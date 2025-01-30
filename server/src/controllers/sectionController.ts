import { Request, Response } from "express";
import { prisma } from "../server";
import qs from "querystring";

// Section
export const getSections = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    courseId,
    page = 1,
    pageSize = 10,
    populate,
    filters,
  }: any = req.query;

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  let include: any = {};
  let where: any = {};

  if (populate === "*") {
    include = {
      Chapter: true,
    };
  } else if (populate) {
    const populateQuery = populate;
    const populateArray = populateQuery
      ? (Array.isArray(populateQuery) ? populateQuery : [populateQuery]).map(
          (field: string | qs.ParseOptions | undefined) =>
            typeof field === "string" ? field.trim() : ""
        )
      : [];

    if (populateArray.includes("Chapter")) {
      include.Chapter = {
        include: {
          quizzes: true,
          CompletedLesson: true,
        },
      };
    } else {
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
    const sections = await prisma.section.findMany({
      skip,
      take,
      include,
      where,
    });

    const totalSections = await prisma.section.count();

    res.status(200).json({
      success: true,
      message: "GET-Sections successful",
      sections,
      totalSections,
      page,
      pageSize,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "GET-Sections failed" });
  }
};

export const createSection = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { courseId, title } = req.body;

  try {
    const section = await prisma.section.create({
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Section güncellenirken bir hata oluştu",
      error: error,
    });
    return;
  }
};

export const editSection = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { sectionId, newTitle } = req.body;

  try {
    const section = await prisma.section.update({
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
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Section güncellenirken bir hata oluştu",
      error: error,
    });
  }
};

export const deleteSection = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const section = await prisma.section.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      section,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Section deletion failed",
      error: error,
    });
  }
};
