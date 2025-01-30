import { Request, Response } from "express";
import { prisma } from "../server";
import qs from "querystring";

// Options
export const getOptions = async (
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
      question: true,
    };
  } else if (populate) {
    const populateQuery = populate;
    const populateArray = populateQuery
      ? (Array.isArray(populateQuery) ? populateQuery : [populateQuery]).map(
          (field: string | qs.ParseOptions | undefined) =>
            typeof field === "string" ? field.trim() : ""
        )
      : [];

    if (populateArray.includes("question")) {
      include.question = true;
    } else {
      include.question = false;
    }
  } else {
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
    const options = await prisma.options.findMany({
      skip,
      take,
      include,
      where,
    });

    const totalOptions = await prisma.options.count();

    res.status(200).json({
      success: true,
      message: "GET-Options successful",
      options,
      totalOptions,
      page,
      pageSize,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "GET-Options failed" });
  }
};

export const createOption = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { questionId, content } = req.body;

  try {
    const option = await prisma.options.create({
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Option güncellenirken bir hata oluştu",
      error: error,
    });
    return;
  }
};

export const editOption = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { optionId, newContent } = req.body;

  try {
    const option = await prisma.options.update({
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
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Option güncellenirken bir hata oluştu",
      error: error,
    });
  }
};

export const deleteOption = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const option = await prisma.options.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Option deleted successfully",
      option,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Option deletion failed",
      error: error,
    });
  }
};
