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
exports.deleteQuiz = exports.editQuiz = exports.createQuiz = exports.getQuizzes = void 0;
const server_1 = require("../server");
// Quiz
const getQuizzes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chapterId, page = 1, pageSize = 10, populate, filters, } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    let include = {};
    let where = {};
    if (populate === "*") {
        include = {
            questions: true,
        };
    }
    else if (populate) {
        const populateQuery = populate;
        const populateArray = populateQuery
            ? (Array.isArray(populateQuery) ? populateQuery : [populateQuery]).map((field) => typeof field === "string" ? field.trim() : "")
            : [];
        if (populateArray.includes("questions")) {
            include.questions = true;
        }
        else {
            include.questions = false;
        }
    }
    else {
        include.questions = false;
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
        const quizzes = yield server_1.prisma.quiz.findMany({
            skip,
            take,
            include,
            where,
        });
        const totalQuizzes = yield server_1.prisma.quiz.count();
        res.status(200).json({
            success: true,
            message: "GET-Quizzes successful",
            quizzes,
            totalQuizzes,
            page,
            pageSize,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "GET-Quizzes failed" });
    }
});
exports.getQuizzes = getQuizzes;
const createQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chapterId, title } = req.body;
    try {
        const quiz = yield server_1.prisma.quiz.create({
            data: {
                title,
                chapter: {
                    connect: {
                        id: chapterId,
                    },
                },
            },
        });
        res.status(201).json({
            success: true,
            message: "Quiz created successfully",
            quiz,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Quiz güncellenirken bir hata oluştu",
            error: error,
        });
        return;
    }
});
exports.createQuiz = createQuiz;
const editQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { quizId, newTitle } = req.body;
    try {
        const quiz = yield server_1.prisma.quiz.update({
            where: { id: quizId },
            data: {
                title: newTitle,
            },
        });
        res.status(200).json({
            success: true,
            message: "Quiz updated successfully",
            quiz,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Quiz güncellenirken bir hata oluştu",
            error: error,
        });
    }
});
exports.editQuiz = editQuiz;
const deleteQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const quiz = yield server_1.prisma.quiz.delete({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: "Quiz deleted successfully",
            quiz,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Quiz deletion failed",
            error: error,
        });
    }
});
exports.deleteQuiz = deleteQuiz;
