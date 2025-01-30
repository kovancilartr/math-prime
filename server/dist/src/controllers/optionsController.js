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
exports.deleteOption = exports.editOption = exports.createOption = exports.getOptions = void 0;
const server_1 = require("../server");
// Options
const getOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { quizId, page = 1, pageSize = 10, populate, filters } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    let include = {};
    let where = {};
    if (populate === "*") {
        include = {
            question: true,
        };
    }
    else if (populate) {
        const populateQuery = populate;
        const populateArray = populateQuery
            ? (Array.isArray(populateQuery) ? populateQuery : [populateQuery]).map((field) => typeof field === "string" ? field.trim() : "")
            : [];
        if (populateArray.includes("question")) {
            include.question = true;
        }
        else {
            include.question = false;
        }
    }
    else {
        include.question = false;
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
        const options = yield server_1.prisma.options.findMany({
            skip,
            take,
            include,
            where,
        });
        const totalOptions = yield server_1.prisma.options.count();
        res.status(200).json({
            success: true,
            message: "GET-Options successful",
            options,
            totalOptions,
            page,
            pageSize,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "GET-Options failed" });
    }
});
exports.getOptions = getOptions;
const createOption = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { questionId, content } = req.body;
    try {
        const option = yield server_1.prisma.options.create({
            data: {
                content,
                question: {
                    connect: {
                        id: questionId,
                    },
                },
            },
        });
        res.status(201).json({
            success: true,
            message: "Option created successfully",
            option,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Option güncellenirken bir hata oluştu",
            error: error,
        });
        return;
    }
});
exports.createOption = createOption;
const editOption = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { optionId, newContent } = req.body;
    try {
        const option = yield server_1.prisma.options.update({
            where: { id: optionId },
            data: {
                content: newContent,
            },
        });
        res.status(200).json({
            success: true,
            message: "Option updated successfully",
            option,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Option güncellenirken bir hata oluştu",
            error: error,
        });
    }
});
exports.editOption = editOption;
const deleteOption = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const option = yield server_1.prisma.options.delete({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: "Option deleted successfully",
            option,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Option deletion failed",
            error: error,
        });
    }
});
exports.deleteOption = deleteOption;
