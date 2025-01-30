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
exports.deleteSection = exports.editSection = exports.createSection = exports.getSections = void 0;
const server_1 = require("../server");
// Section
const getSections = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId, page = 1, pageSize = 10, populate, filters, } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    let include = {};
    let where = {};
    if (populate === "*") {
        include = {
            Chapter: true,
        };
    }
    else if (populate) {
        const populateQuery = populate;
        const populateArray = populateQuery
            ? (Array.isArray(populateQuery) ? populateQuery : [populateQuery]).map((field) => typeof field === "string" ? field.trim() : "")
            : [];
        if (populateArray.includes("Chapter")) {
            include.Chapter = {
                include: {
                    quizzes: true,
                    CompletedLesson: true,
                },
            };
        }
        else {
            include.Chapter = true;
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
        console.log(where);
    }
    try {
        const sections = yield server_1.prisma.section.findMany({
            skip,
            take,
            include,
            where,
        });
        const totalSections = yield server_1.prisma.section.count();
        res.status(200).json({
            success: true,
            message: "GET-Sections successful",
            sections,
            totalSections,
            page,
            pageSize,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "GET-Sections failed" });
    }
});
exports.getSections = getSections;
const createSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId, title } = req.body;
    try {
        const section = yield server_1.prisma.section.create({
            data: {
                title,
                course: {
                    connect: {
                        id: courseId,
                    },
                },
            },
        });
        res.status(201).json({
            success: true,
            message: "Section created successfully",
            section,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Section güncellenirken bir hata oluştu",
            error: error,
        });
        return;
    }
});
exports.createSection = createSection;
const editSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sectionId, newTitle } = req.body;
    try {
        const section = yield server_1.prisma.section.update({
            where: { id: sectionId },
            data: {
                title: newTitle,
            },
        });
        res.status(200).json({
            success: true,
            message: "Section updated successfully",
            section,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Section güncellenirken bir hata oluştu",
            error: error,
        });
    }
});
exports.editSection = editSection;
const deleteSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const section = yield server_1.prisma.section.delete({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: "Section deleted successfully",
            section,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Section deletion failed",
            error: error,
        });
    }
});
exports.deleteSection = deleteSection;
