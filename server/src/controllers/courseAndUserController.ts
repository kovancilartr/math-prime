import { Request, Response } from "express";
import { prisma } from "../server";

export const CourseEnrollment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { courseId, userId } = req.body;

  try {
    const courseEnrollment = await prisma.courseEnrollment.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        course: {
          connect: {
            id: courseId,
          },
        },
      },
    });
    res.status(201).json({
      success: true,
      message: "CourseEnrollment created successfully",
      courseEnrollment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "CourseEnrollment güncellenirken bir hata oluştu",
      error: error,
    });
    return;
  }
};

export const GetCourseEnrollment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, courseId } = req.params;

  try {
    const courseEnrollment = await prisma.courseEnrollment.findFirst({
      where: {
        userId: userId,
        courseId: courseId,
      },
      include: {
        user: true,
        course: true,
      },
    });

    if (!courseEnrollment) {
      res.status(200).json({
        success: false,
        message: "CourseEnrollment not found",
        error: "CourseEnrollment not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "CourseEnrollment found successfully",
      courseEnrollment,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "CourseEnrollment not found",
      error: error,
    });
  }
};

export const DeleteCourseEnrollment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const courseEnrollment = await prisma.courseEnrollment.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "CourseEnrollment deleted successfully",
      courseEnrollment,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "CourseEnrollment deletion failed",
      error: error,
    });
  }
};

export const CompletedLesson = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, chapterId } = req.body;

  try {
    const completedLesson = await prisma.completedLesson.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        chapter: {
          connect: {
            id: chapterId,
          },
        },
      },
    });
    res.status(201).json({
      success: true,
      message: "CompletedLesson created successfully",
      completedLesson,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "CompletedLesson güncellenirken bir hata oluştu",
      error: error,
    });
    return;
  }
};

export const DeleteCompletedLesson = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const completedLesson = await prisma.completedLesson.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "CompletedLesson deleted successfully",
      completedLesson,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "CompletedLesson deletion failed",
      error: error,
    });
  }
};
