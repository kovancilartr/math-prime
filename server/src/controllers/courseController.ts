import { Request, Response } from "express";
import { prisma } from "../server";
import qs from "querystring";

// API İSTEĞİ => http://localhost:3001/api/v1/get-courses?populate=Section&populate=Rating&pageSize=1 örnek
// Course
export const getCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { page = 1, pageSize = 50, populate, filters }: any = req.query;

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  let include: any = {};
  let where: any = {};

  if (populate === "*") {
    include = {
      section: {
        include: {
          chapter: {
            include: {
              quizzes: true,
              completedLesson: true,
            },
          },
        },
      },
      categories: true,
      courseEnrollment: true,
      rating: true,
      instructor: true,
    };
  } else if (populate) {
    const populateQuery = populate;
    const populateArray = populateQuery
      ? (Array.isArray(populateQuery) ? populateQuery : [populateQuery]).map(
          (field: string | qs.ParseOptions | undefined) =>
            typeof field === "string" ? field.trim() : ""
        )
      : [];

    if (populateArray.includes("section")) {
      include.section = {
        include: {
          chapter: {
            include: {
              quizzes: true,
              completedLesson: true,
            },
          },
        },
      };
    }

    if (populateArray.includes("category")) {
      include.categories = {
        include: {
          course: true,
        },
      };
    }

    if (populateArray.includes("courseEnrollment")) {
      include.courseEnrollment = {
        include: {
          user: true,
        },
      };
    }

    if (populateArray.includes("rating")) {
      include.rating = true;
    }

    if (populateArray.includes("instructor")) {
      include.instructor = true;
    }
  }

  if (filters) {
    Object.keys(filters).forEach((field) => {
      const operatorObj = filters[field];

      Object.keys(operatorObj).forEach((operator) => {
        const operatorValue = operatorObj[operator];

        switch (operator) {
          case "$eq":
            // Eğer field boolean ise
            if (field === "isPublished") {
              where[field] = { equals: operatorValue === "true" }; // string'i boolean'a çevir
            } else {
              where[field] = { equals: operatorValue }; // diğer alanlar için doğrudan kullan
            }
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
    const courses = await prisma.course.findMany({
      skip,
      take,
      include,
      where,
    });

    const totalCourses = await prisma.course.count();

    res.status(200).json({
      success: true,
      message: "GET-Courses successful",
      data: courses,
      totalCourses,
      page,
      pageSize,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "GET-Courses failed" });
  }
};

export const createCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    instructorId,
    title,
    description,
    courseVideoUrl,
    price,
    thumbnail,
    isPublished,
    categoryId,
  } = req.body;

  // price'ı number'a çevir
  const parsedPrice = typeof price === "number" ? price : parseFloat(price);

  try {
    const course = await prisma.course.create({
      data: {
        title,
        description,
        courseVideoUrl,
        price: parsedPrice,
        thumbnail,
        isPublished,
        instructor: {
          connect: {
            id: instructorId,
          },
        },
        categories: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Course creation failed" });
  }
};

export const editCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    id,
    newTitle,
    newDescription,
    newCourseVideoUrl,
    newPrice,
    newThumbnail,
    newIsPublished,
    newInstructorId,
    newCategoryId,
  } = req.body;

  // price'ı number'a çevir
  const parsedPrice =
    typeof newPrice === "number" ? newPrice : parseFloat(newPrice);

  try {
    const course = await prisma.course.update({
      where: { id },
      data: {
        title: newTitle,
        description: newDescription,
        courseVideoUrl: newCourseVideoUrl,
        price: parsedPrice,
        thumbnail: newThumbnail,
        isPublished: newIsPublished,
        instructorId: newInstructorId,
        ...(newCategoryId && {
          categories: {
            connect: {
              id: newCategoryId,
            },
          },
        }),
      },
    });

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        message: "Gönderilen Kurs Id ile ilgili bilgiler bulunamadı",
        error: error.code,
      });
      return;
    } else {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Kurs güncellenirken bir hata oluştu",
        error: error.code,
      });
      return;
    }
  }
};

export const deleteCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const course = await prisma.course.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      course,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Course deletion failed",
      error: error.code,
    });
  }
};
