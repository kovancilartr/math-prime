import { Request, Response } from "express";
import { prisma } from "../server";
import qs from "querystring";

// Question
export const getQuestions = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { quizId, page = 1, pageSize = 10, populate, filters }: any = req.query;

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  let include: any = {};
  let where: any = {};

  if (populate === "*") {
    include = {
      options: true,
    };
  } else if (populate) {
    const populateQuery = populate;
    const populateArray = populateQuery
      ? (Array.isArray(populateQuery) ? populateQuery : [populateQuery]).map(
          (field: string | qs.ParseOptions | undefined) =>
            typeof field === "string" ? field.trim() : ""
        )
      : [];

    if (populateArray.includes("options")) {
      include.options = true;
    } else {
      include.options = false;
    }
  } else {
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
    const questions = await prisma.question.findMany({
      skip,
      take,
      include,
      where,
    });

    const totalQuestions = await prisma.question.count();

    res.status(200).json({
      success: true,
      message: "GET-Questions successful",
      questions,
      totalQuestions,
      page,
      pageSize,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "GET-Questions failed" });
  }
};

export const createQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { quizId, content, answer } = req.body;

  try {
    const question = await prisma.question.create({
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Question güncellenirken bir hata oluştu",
      error: error,
    });
    return;
  }
};

export const editQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { questionId, newContent, newAnswer } = req.body;

  try {
    const question = await prisma.question.update({
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
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Question güncellenirken bir hata oluştu",
      error: error,
    });
  }
};

export const deleteQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const question = await prisma.question.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
      question,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Question deletion failed",
      error: error,
    });
  }
};
