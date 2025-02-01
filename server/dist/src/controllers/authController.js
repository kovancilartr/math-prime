"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.editUser = exports.getUserById = exports.getAllUsers = exports.logout = exports.refreshAccessToken = exports.login = exports.register = void 0;
const server_1 = require("../server");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Token oluşturma fonksiyonları
function generateAccessToken(userId, email, role) {
    return jsonwebtoken_1.default.sign({ userId, email, role }, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });
}
function generateRefreshToken(userId, email, role) {
    return jsonwebtoken_1.default.sign({ userId, email, role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
}
function setToken(res, refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // Süreyi milisaniye cinsinden belirtin
        });
        console.log("Access and refresh tokens set successfully."); // Başarılı işlem sonrası konsola bilgi ver
    });
}
// API Kontrollerleri
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, surname, email, password, role, status } = req.body;
        const existingUser = yield server_1.prisma.user.findUnique({
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
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        const user = yield server_1.prisma.user.create({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Register failed" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const extractCurrentUser = yield server_1.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!extractCurrentUser ||
            !(yield bcryptjs_1.default.compare(password, extractCurrentUser.password))) {
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
        }
        else if (extractCurrentUser.status === "PENDING") {
            res.status(401).json({
                success: false,
                error: "Üzgünüz, hesabınız onay bekliyor",
            });
            return;
        }
        else if (extractCurrentUser.status === "ACTIVE") {
            // Tokenları oluştur
            const accessToken = generateAccessToken(extractCurrentUser.id, extractCurrentUser.email, extractCurrentUser.role);
            const refreshToken = generateRefreshToken(extractCurrentUser.id, extractCurrentUser.email, extractCurrentUser.role);
            yield setToken(res, refreshToken);
            yield server_1.prisma.user.update({
                where: { id: extractCurrentUser.id },
                data: { refreshToken },
            });
            res.status(200).json({
                success: true,
                message: "Süper, giriş yaptınız!",
                accessToken,
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Üzgünüz, bir hata oluştu" });
    }
});
exports.login = login;
const refreshAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.refreshAccessToken = refreshAccessToken;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });
});
exports.logout = logout;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, pageSize = 10, populate, filters } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    let include = {};
    let where = {};
    if (populate === "*") {
        include = {
            CompletedLesson: true,
            CourseEnrollment: true,
            Rating: true,
        };
    }
    else if (populate) {
        const populateQuery = populate;
        const populateArray = populateQuery
            ? (Array.isArray(populateQuery) ? populateQuery : [populateQuery]).map((field) => typeof field === "string" ? field.trim() : "")
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
        const users = yield server_1.prisma.user.findMany({
            skip,
            take,
            include,
            where,
        });
        const totalUsers = yield server_1.prisma.user.count();
        res.status(200).json({
            success: true,
            message: "GET-Users successful",
            users,
            totalUsers,
            page,
            pageSize,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "GET-Users failed" });
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield server_1.prisma.user.findUnique({
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
});
exports.getUserById = getUserById;
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, newName, newSurname, newEmail, newPassword, newRole, newStatus } = req.body;
    try {
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Bir kullanıcı ID'si belirtilmeli",
            });
            return;
        }
        // Kullanıcının mevcut bilgilerini al
        const user = yield server_1.prisma.user.findUnique({
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
            const isSamePassword = yield bcryptjs_1.default.compare(newPassword, user.password);
            if (isSamePassword) {
                res.status(400).json({
                    success: false,
                    message: "Yeni şifre eski şifre ile aynı olamaz",
                });
                return;
            }
            // Yeni şifreyi hashle
            const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 12);
            // Kullanıcıyı güncelle
            const responese = yield server_1.prisma.user.update({
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
        }
        else {
            // Yeni şifre gelmediyse, sadece diğer bilgileri güncelle
            const responese = yield server_1.prisma.user.update({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Kullanıcı güncellenirken hata oluştu",
            error: error,
        });
    }
});
exports.editUser = editUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ids } = req.body; // ID'leri body'den al
    if (!Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({
            success: false,
            message: "No user IDs provided",
        });
        return;
    }
    const users = yield server_1.prisma.user.findMany({
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
    yield server_1.prisma.user.deleteMany({
        where: {
            id: { in: ids }, // Silinecek kullanıcıları belirle
        },
    });
    res.status(200).json({
        success: true,
        message: `${users.length} user(s) deleted`,
    });
});
exports.deleteUser = deleteUser;
