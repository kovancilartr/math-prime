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
exports.deleteQuestion = exports.editQuestion = exports.createQuestion = exports.getQuestions = void 0;
const server_1 = require("../server");
// Question
const getQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { quizId, page = 1, pageSize = 10, populate, filters } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    let include = {};
    let where = {};
    if (populate === "*") {
        include = {
            options: true,
        };
    }
    else if (populate) {
        const populateQuery = populate;
        const populateArray = populateQuery
            ? (Array.isArray(populateQuery) ? populateQuery : [populateQuery]).map((field) => typeof field === "string" ? field.trim() : "")
            : [];
        if (populateArray.includes("options")) {
            include.options = true;
        }
        else {
            include.options = false;
        }
    }
    else {
        include.options = false;
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
        const questions = yield server_1.prisma.question.findMany({
            skip,
            take,
            include,
            where,
        });
        const totalQuestions = yield server_1.prisma.question.count();
        res.status(200).json({
            success: true,
            message: "GET-Questions successful",
            questions,
            totalQuestions,
            page,
            pageSize,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "GET-Questions failed" });
    }
});
exports.getQuestions = getQuestions;
const createQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { quizId, content, answer } = req.body;
    try {
        const question = yield server_1.prisma.question.create({
            data: {
                content,
                answer,
                quiz: {
                    connect: {
                        id: quizId,
                    },
                },
            },
        });
        res.status(201).json({
            success: true,
            message: "Question created successfully",
            question,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Question güncellenirken bir hata oluştu",
            error: error,
        });
        return;
    }
});
exports.createQuestion = createQuestion;
const editQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { questionId, newContent, newAnswer } = req.body;
    try {
        const question = yield server_1.prisma.question.update({
            where: { id: questionId },
            data: {
                content: newContent,
                answer: newAnswer,
            },
        });
        res.status(200).json({
            success: true,
            message: "Question updated successfully",
            question,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Question güncellenirken bir hata oluştu",
            error: error,
        });
    }
});
exports.editQuestion = editQuestion;
const deleteQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const question = yield server_1.prisma.question.delete({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: "Question deleted successfully",
            question,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Question deletion failed",
            error: error,
        });
    }
});
exports.deleteQuestion = deleteQuestion;
