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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.editCourse = exports.createCourse = exports.getCourses = void 0;
const server_1 = require("../server");
// API İSTEĞİ => http://localhost:3001/api/v1/get-courses?populate=Section&populate=Rating&pageSize=1 örnek
// Course
const getCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, pageSize = 50, populate, filters } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    let include = {};
    let where = {};
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
    }
    else if (populate) {
        const populateQuery = populate;
        const populateArray = populateQuery
            ? (Array.isArray(populateQuery) ? populateQuery : [populateQuery]).map((field) => typeof field === "string" ? field.trim() : "")
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
                        }
                        else {
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
        const courses = yield server_1.prisma.course.findMany({
            skip,
            take,
            include,
            where,
        });
        const totalCourses = yield server_1.prisma.course.count();
        res.status(200).json({
            success: true,
            message: "GET-Courses successful",
            data: courses,
            totalCourses,
            page,
            pageSize,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "GET-Courses failed" });
    }
});
exports.getCourses = getCourses;
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { instructorId, title, description, courseVideoUrl, price, thumbnail, isPublished, categoryId, } = req.body;
    // price'ı number'a çevir
    const parsedPrice = typeof price === "number" ? price : parseFloat(price);
    try {
        const course = yield server_1.prisma.course.create({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Course creation failed" });
    }
});
exports.createCourse = createCourse;
const editCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, newTitle, newDescription, newCourseVideoUrl, newPrice, newThumbnail, newIsPublished, newInstructorId, newCategoryId, } = req.body;
    // price'ı number'a çevir
    const parsedPrice = typeof newPrice === "number" ? newPrice : parseFloat(newPrice);
    try {
        const course = yield server_1.prisma.course.update({
            where: { id },
            data: Object.assign({ title: newTitle, description: newDescription, courseVideoUrl: newCourseVideoUrl, price: parsedPrice, thumbnail: newThumbnail, isPublished: newIsPublished, instructorId: newInstructorId }, (newCategoryId && {
                categories: {
                    connect: {
                        id: newCategoryId,
                    },
                },
            })),
        });
        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course,
        });
    }
    catch (error) {
        if (error.code === "P2025") {
            res.status(404).json({
                success: false,
                message: "Gönderilen Kurs Id ile ilgili bilgiler bulunamadı",
                error: error.code,
            });
            return;
        }
        else {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Kurs güncellenirken bir hata oluştu",
                error: error.code,
            });
            return;
        }
    }
});
exports.editCourse = editCourse;
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const course = yield server_1.prisma.course.delete({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
            course,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Course deletion failed",
            error: error.code,
        });
    }
});
exports.deleteCourse = deleteCourse;
