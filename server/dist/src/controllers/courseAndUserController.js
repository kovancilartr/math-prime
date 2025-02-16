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
exports.DeleteCompletedLesson = exports.CompletedLesson = exports.DeleteCourseEnrollment = exports.GetCourseEnrollment = exports.CreateCourseEnrollment = void 0;
const server_1 = require("../server");
const CreateCourseEnrollment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId, userId } = req.body;
    try {
        const courseEnrollment = yield server_1.prisma.courseEnrollment.create({
            data: {
                user: {
                    connect: {
                        id: userId,
                    },
                },
                course: {
                    connect: {
                        id: courseId,
                    },
                },
            },
        });
        res.status(201).json({
            success: true,
            message: "CourseEnrollment created successfully",
            courseEnrollment,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "CourseEnrollment güncellenirken bir hata oluştu",
            error: error,
        });
        return;
    }
});
exports.CreateCourseEnrollment = CreateCourseEnrollment;
const GetCourseEnrollment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, courseId } = req.params;
    try {
        const courseEnrollment = yield server_1.prisma.courseEnrollment.findFirst({
            where: {
                userId: userId,
                courseId: courseId,
            },
            include: {
                user: true,
                course: true,
            },
        });
        if (!courseEnrollment) {
            res.status(200).json({
                success: false,
                message: "CourseEnrollment not found",
                error: "CourseEnrollment not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "CourseEnrollment found successfully",
            courseEnrollment,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "CourseEnrollment not found",
            error: error,
        });
    }
});
exports.GetCourseEnrollment = GetCourseEnrollment;
const DeleteCourseEnrollment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const courseEnrollment = yield server_1.prisma.courseEnrollment.delete({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: "CourseEnrollment deleted successfully",
            courseEnrollment,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "CourseEnrollment deletion failed",
            error: error,
        });
    }
});
exports.DeleteCourseEnrollment = DeleteCourseEnrollment;
const CompletedLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, chapterId } = req.body;
    try {
        const completedLesson = yield server_1.prisma.completedLesson.create({
            data: {
                user: {
                    connect: {
                        id: userId,
                    },
                },
                chapter: {
                    connect: {
                        id: chapterId,
                    },
                },
            },
        });
        res.status(201).json({
            success: true,
            message: "CompletedLesson created successfully",
            completedLesson,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "CompletedLesson güncellenirken bir hata oluştu",
            error: error,
        });
        return;
    }
});
exports.CompletedLesson = CompletedLesson;
const DeleteCompletedLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const completedLesson = yield server_1.prisma.completedLesson.delete({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: "CompletedLesson deleted successfully",
            completedLesson,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "CompletedLesson deletion failed",
            error: error,
        });
    }
});
exports.DeleteCompletedLesson = DeleteCompletedLesson;
