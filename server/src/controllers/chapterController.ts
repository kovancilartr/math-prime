import { Request, Response } from "express";
import { prisma } from "../server";
import qs from "querystring";

// Chapter

export const getChapters = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    sectionId,
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
      quizzes: true,
      CompletedLesson: true,
    };
  } else if (populate) {
    const populateQuery = populate;
    const populateArray = populateQuery
      ? (Array.isArray(populateQuery) ? populateQuery : [populateQuery]).map(
          (field: string | qs.ParseOptions | undefined) =>
            typeof field === "string" ? field.trim() : ""
        )
      : [];

    if (populateArray.includes("quizzes")) {
      include.quizzes = true;
    } else {
      include.quizzes = false;
    }

    if (populateArray.includes("CompletedLesson")) {
      include.CompletedLesson = true;
    } else {
      include.CompletedLesson = false;
    }
  } else {
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
    const chapters = await prisma.chapter.findMany({
      skip,
      take,
      include,
      where,
    });

    const totalChapters = await prisma.chapter.count();

    res.status(200).json({
      success: true,
      message: "GET-Chapters successful",
      chapters,
      totalChapters,
      page,
      pageSize,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "GET-Chapters failed" });
  }
};

export const createChapter = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { sectionId, title, videoUrl, pdfUrl } = req.body;

  try {
    const chapter = await prisma.chapter.create({
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Chapter güncellenirken bir hata oluştu",
      error: error,
    });
    return;
  }
};

export const editChapter = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { chapterId, newTitle, newVideoUrl, newPdfUrl } = req.body;

  try {
    const chapter = await prisma.chapter.update({
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
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Chapter güncellenirken bir hata oluştu",
      error: error,
    });
  }
};

export const deleteChapter = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const chapter = await prisma.chapter.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Chapter deleted successfully",
      chapter,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Chapter deletion failed",
      error: error,
    });
  }
};
