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
exports.getCategories = void 0;
const server_1 = require("../server");
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, pageSize = 50, populate, filters } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Math.min(Number(pageSize), 100); // En fazla 100 eleman alınabilir
    const generateInclude = (populate) => {
        const validRelations = ["courses"]; // Geçerli ilişkiler
        const include = {};
        if (populate === "*") {
            return {
                courses: {
                    include: {
                        categories: true,
                    },
                },
            };
        }
        const populateArray = Array.isArray(populate) ? populate : [populate];
        populateArray.forEach((relation) => {
            if (validRelations.includes(relation)) {
                include[relation] = true;
            }
        });
        return include;
    };
    const generateWhere = (filters) => {
        const where = {};
        if (filters && typeof filters === "object") {
            Object.keys(filters).forEach((field) => {
                const operatorObj = filters[field];
                if (typeof operatorObj === "object") {
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
                }
            });
        }
        return where;
    };
    const include = generateInclude(populate);
    const where = generateWhere(filters);
    try {
        const categories = yield server_1.prisma.category.findMany({
            skip,
            take,
            include,
            where,
        });
        const totalCategories = yield server_1.prisma.category.count();
        const totalFilteredCategories = yield server_1.prisma.category.count({ where });
        const totalPages = Math.ceil(totalFilteredCategories / take);
        res.status(200).json({
            success: true,
            message: "GET-Categories successful",
            data: categories,
            totalCategories,
            totalFilteredCategories,
            page: Number(page),
            pageSize: Number(pageSize),
            totalPages,
            hasNextPage: Number(page) < totalPages,
            hasPrevPage: Number(page) > 1,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "GET-Categories failed" });
    }
});
exports.getCategories = getCategories;
