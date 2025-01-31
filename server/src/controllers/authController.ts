import { Request, Response } from "express";
import { prisma } from "../server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import qs from "querystring";

// Custom Fonksiyonlar
function generateToken(userId: string, email: string, role: string) {
  const accessToken = jwt.sign(
    {
      userId,
      email,
      role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h", // 1 hour
    }
  );
  const refreshToken = uuidv4();
  return { accessToken, refreshToken };
}

async function setToken(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true, // Railway zaten HTTPS, o yüzden true olacak
    sameSite: "none", // "strict" veya "lax" yerine "none" yap
    maxAge: 60 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // Süreyi milisaniye cinsinden belirtin
  });
  console.log("Access and refresh tokens set successfully."); // Başarılı işlem sonrası konsola bilgi ver
}

// API Kontrollerleri
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, surname, email, password, role, status } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: "User with this email already exists",
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        surname,
        email,
        password: hashedPassword,
        role: role,
        status: status,
      },
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: user.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Register failed" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const extractCurrentUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (
      !extractCurrentUser ||
      !(await bcrypt.compare(password, extractCurrentUser.password))
    ) {
      res.status(401).json({
        success: false,
        error: "Üzgünüz, kullanıcı adı ya da şifre hatalı",
      });
      return;
    }
    if (extractCurrentUser.status === "INACTIVE") {
      res.status(401).json({
        success: false,
        error: "Üzgünüz, bu hesap iptal edildi",
      });
      return;
    } else if (extractCurrentUser.status === "PENDING") {
      res.status(401).json({
        success: false,
        error: "Üzgünüz, hesabınız onay bekliyor",
      });
      return;
    } else if (extractCurrentUser.status === "ACTIVE") {
      // Generate access and refresh tokens
      const { accessToken, refreshToken } = generateToken(
        extractCurrentUser.id,
        extractCurrentUser.email,
        extractCurrentUser.role
      );

      // Set access and refresh tokens in cookies
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      await setToken(res, accessToken, refreshToken);

      await prisma.user.update({
        where: { id: extractCurrentUser.id },
        data: { refreshToken },
      });

      res.status(200).json({
        success: true,
        message: "Süper, giriş yaptınız!",
        user: {
          id: extractCurrentUser.id,
          name: extractCurrentUser.name,
          surname: extractCurrentUser.surname,
          email: extractCurrentUser.email,
          role: extractCurrentUser.role,
          status: extractCurrentUser.status,
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Üzgünüz, bir hata oluştu" });
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json({
      success: false,
      error: "Invalid refresh token",
    });
    return;
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        refreshToken,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    const { accessToken, refreshToken: newRefreshToken } = generateToken(
      user.id,
      user.email,
      user.role
    );

    await setToken(res, accessToken, newRefreshToken);
    res.status(200).json({
      success: true,
      message: "Refresh token refreshed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Refresh token error" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { page = 1, pageSize = 10, populate, filters }: any = req.query;

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  let include: any = {};
  let where: any = {};

  if (populate === "*") {
    include = {
      CompletedLesson: true,
      CourseEnrollment: true,
      Rating: true,
    };
  } else if (populate) {
    const populateQuery = populate;
    const populateArray = populateQuery
      ? (Array.isArray(populateQuery) ? populateQuery : [populateQuery]).map(
          (field: string | qs.ParseOptions | undefined) =>
            typeof field === "string" ? field.trim() : ""
        )
      : [];

    if (populateArray.includes("CompletedLesson")) {
      include.Section = {
        include: {
          Chapter: {
            include: {
              quizzes: true,
              CompletedLesson: true,
            },
          },
        },
      };
    }

    if (populateArray.includes("CourseEnrollment")) {
      include.CourseEnrollment = {
        include: {
          user: true,
        },
      };
    }

    if (populateArray.includes("Rating")) {
      include.Rating = true;
    }
  }

  if (filters) {
    Object.keys(filters).forEach((field) => {
      const operatorObj = filters[field];

      Object.keys(operatorObj).forEach((operator) => {
        const operatorValue = operatorObj[operator];

        switch (operator) {
          case "$eq":
            where[field] = { equals: operatorValue };
            break;
          case "$ne":
            where[field] = { not: operatorValue };
            break;
          case "$contains":
            where[field] = { contains: operatorValue };
            break;
          case "$in":
            where[field] = { in: operatorValue.split(",") };
            break;
          case "$gt":
            where[field] = { gt: operatorValue };
            break;
          case "$gte":
            where[field] = { gte: operatorValue };
            break;
          case "$lt":
            where[field] = { lt: operatorValue };
            break;
          case "$lte":
            where[field] = { lte: operatorValue };
            break;
          default:
            break;
        }
      });
    });
  }

  try {
    const users = await prisma.user.findMany({
      skip,
      take,
      include,
      where,
    });

    const totalUsers = await prisma.user.count();

    res.status(200).json({
      success: true,
      message: "GET-Users successful",
      users,
      totalUsers,
      page,
      pageSize,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "GET-Users failed" });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  res.status(200).json(user);
};

export const editUser = async (req: Request, res: Response): Promise<void> => {
  const { id, newName, newSurname, newEmail, newPassword, newRole, newStatus } =
    req.body;

  try {
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Bir kullanıcı ID'si belirtilmeli",
      });
      return;
    }

    // Kullanıcının mevcut bilgilerini al
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı",
      });
      return;
    }

    // Yeni şifre kontrolü
    if (newPassword) {
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        res.status(400).json({
          success: false,
          message: "Yeni şifre eski şifre ile aynı olamaz",
        });
        return;
      }

      // Yeni şifreyi hashle
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Kullanıcıyı güncelle
      const responese = await prisma.user.update({
        where: { id },
        data: {
          name: newName,
          surname: newSurname,
          email: newEmail,
          role: newRole,
          status: newStatus,
          password: hashedPassword,
        },
      });
      console.log("Update response: ", responese);

      // Güncellenen kullanıcıyı döndür
      res.status(200).json({
        success: true,
        message: "Kullanıcı başarıyla güncellendi",
        user: responese, // Güncellenen kullanıcı bilgilerini döndür
      });
    } else {
      // Yeni şifre gelmediyse, sadece diğer bilgileri güncelle
      const responese = await prisma.user.update({
        where: { id },
        data: {
          name: newName,
          surname: newSurname,
          email: newEmail,
          role: newRole,
          status: newStatus,
        },
      });
      console.log("Update response: ", responese);

      // Güncellenen kullanıcıyı döndür
      res.status(200).json({
        success: true,
        message: "Kullanıcı başarıyla güncellendi",
        user: responese, // Güncellenen kullanıcı bilgilerini döndür
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Kullanıcı güncellenirken hata oluştu",
      error: error as Error,
    });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { ids } = req.body; // ID'leri body'den al

  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({
      success: false,
      message: "No user IDs provided",
    });
    return;
  }

  const users = await prisma.user.findMany({
    where: {
      id: { in: ids }, // Birden fazla ID ile sorgula
    },
  });

  if (users.length === 0) {
    res.status(404).json({
      success: false,
      message: "No users found",
    });
    return;
  }

  await prisma.user.deleteMany({
    where: {
      id: { in: ids }, // Silinecek kullanıcıları belirle
    },
  });

  res.status(200).json({
    success: true,
    message: `${users.length} user(s) deleted`,
  });
};
