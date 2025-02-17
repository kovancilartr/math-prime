import { Request, Response } from "express";
import { prisma } from "../server";

export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { page = 1, pageSize = 50, populate, filters }: any = req.query;

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Math.min(Number(pageSize), 100); // En fazla 100 eleman alınabilir

  const generateInclude = (populate: string | string[]) => {
    const validRelations = ["courses"]; // Geçerli ilişkiler
    const include: any = {};

    if (populate === "*") {
      return {
        courses: {
          include: {
            categories: true,
            courseEnrollment: true,
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

  const generateWhere = (filters: any) => {
    const where: any = {};

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
    const categories = await prisma.category.findMany({
      skip,
      take,
      include,
      where,
    });

    const totalCategories = await prisma.category.count();
    const totalFilteredCategories = await prisma.category.count({ where });
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "GET-Categories failed" });
  }
};
