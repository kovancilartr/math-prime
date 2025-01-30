import { Request, Response } from "express";
import { prisma } from "../server";
import qs from "querystring";

// Quiz
export const getQuizzes = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    chapterId,
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
      questions: true,
    };
  } else if (populate) {
    const populateQuery = populate;
    const populateArray = populateQuery
      ? (Array.isArray(populateQuery) ? populateQuery : [populateQuery]).map(
          (field: string | qs.ParseOptions | undefined) =>
            typeof field === "string" ? field.trim() : ""
        )
      : [];

    if (populateArray.includes("questions")) {
      include.questions = true;
    } else {
      include.questions = false;
    }
  } else {
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
    const quizzes = await prisma.quiz.findMany({
      skip,
      take,
      include,
      where,
    });

    const totalQuizzes = await prisma.quiz.count();

    res.status(200).json({
      success: true,
      message: "GET-Quizzes successful",
      quizzes,
      totalQuizzes,
      page,
      pageSize,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "GET-Quizzes failed" });
  }
};

export const createQuiz = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { chapterId, title } = req.body;

  try {
    const quiz = await prisma.quiz.create({
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Quiz güncellenirken bir hata oluştu",
      error: error,
    });
    return;
  }
};

export const editQuiz = async (req: Request, res: Response): Promise<void> => {
  const { quizId, newTitle } = req.body;

  try {
    const quiz = await prisma.quiz.update({
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
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Quiz güncellenirken bir hata oluştu",
      error: error,
    });
  }
};

export const deleteQuiz = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const quiz = await prisma.quiz.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
      quiz,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Quiz deletion failed",
      error: error,
    });
  }
};
