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
exports.deleteCompletedChapter = exports.completeChapter = exports.deleteChapter = exports.editChapter = exports.createChapter = exports.getChapters = void 0;
const server_1 = require("../server");
// Chapter
const getChapters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sectionId, page = 1, pageSize = 10, populate, filters, } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    let include = {};
    let where = {};
    if (populate === "*") {
        include = {
            quizzes: true,
            CompletedLesson: true,
        };
    }
    else if (populate) {
        const populateQuery = populate;
        const populateArray = populateQuery
            ? (Array.isArray(populateQuery) ? populateQuery : [populateQuery]).map((field) => typeof field === "string" ? field.trim() : "")
            : [];
        if (populateArray.includes("quizzes")) {
            include.quizzes = true;
        }
        else {
            include.quizzes = false;
        }
        if (populateArray.includes("CompletedLesson")) {
            include.CompletedLesson = true;
        }
        else {
            include.CompletedLesson = false;
        }
    }
    else {
        include.quizzes = false;
        include.CompletedLesson = false;
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
        console.log(where);
    }
    try {
        const chapters = yield server_1.prisma.chapter.findMany({
            skip,
            take,
            include,
            where,
        });
        const totalChapters = yield server_1.prisma.chapter.count();
        res.status(200).json({
            success: true,
            message: "GET-Chapters successful",
            chapters,
            totalChapters,
            page,
            pageSize,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "GET-Chapters failed" });
    }
});
exports.getChapters = getChapters;
const createChapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sectionId, title, videoUrl, pdfUrl } = req.body;
    try {
        const chapter = yield server_1.prisma.chapter.create({
            data: {
                title,
                videoUrl,
                pdfUrl,
                section: {
                    connect: {
                        id: sectionId,
                    },
                },
            },
        });
        res.status(201).json({
            success: true,
            message: "Chapter created successfully",
            chapter,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Chapter güncellenirken bir hata oluştu",
            error: error,
        });
        return;
    }
});
exports.createChapter = createChapter;
const editChapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chapterId, newTitle, newVideoUrl, newPdfUrl } = req.body;
    try {
        const chapter = yield server_1.prisma.chapter.update({
            where: { id: chapterId },
            data: {
                title: newTitle,
                videoUrl: newVideoUrl,
                pdfUrl: newPdfUrl,
            },
        });
        res.status(200).json({
            success: true,
            message: "Chapter updated successfully",
            chapter,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Chapter güncellenirken bir hata oluştu",
            error: error,
        });
    }
});
exports.editChapter = editChapter;
const deleteChapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const chapter = yield server_1.prisma.chapter.delete({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: "Chapter deleted successfully",
            chapter,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Chapter deletion failed",
            error: error,
        });
    }
});
exports.deleteChapter = deleteChapter;
const completeChapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, chapterId } = req.body;
    try {
        const completeChapter = yield server_1.prisma.completedLesson.create({
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
            message: "Chapter tamamlanıyor",
            completeChapter,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Chapter tamamlanırken bir hata oluştu",
            error: error,
        });
        return;
    }
});
exports.completeChapter = completeChapter;
const deleteCompletedChapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chapterId, userId } = req.params;
    try {
        // İlk olarak, silmek istediğiniz kaydın id'sini alın
        const completedLesson = yield server_1.prisma.completedLesson.findFirst({
            where: {
                userId: userId,
                chapterId: chapterId,
            },
        });
        if (!completedLesson) {
            res.status(404).json({
                success: false,
                message: "Tamamlanan bölüm bulunamadı.",
            });
        }
        // Bulunan kaydı silin
        const deletedChapter = yield server_1.prisma.completedLesson.delete({
            where: {
                id: completedLesson.id, // Burada id'yi kullanıyoruz
            },
        });
        res.status(200).json({
            success: true,
            message: "Tamamlanan bölüm başarıyla silindi.",
            deletedChapter,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Tamamlanan bölüm silinirken bir hata oluştu.",
            error: error,
        });
    }
});
exports.deleteCompletedChapter = deleteCompletedChapter;
