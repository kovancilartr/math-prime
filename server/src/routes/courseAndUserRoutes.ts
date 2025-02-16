import express from "express";
import {
  CompletedLesson,
  CreateCourseEnrollment,
  DeleteCompletedLesson,
  DeleteCourseEnrollment,
  GetCourseEnrollment,
} from "../controllers/courseAndUserController";

const router = express.Router();

router.post("/create-course-enrollment", CreateCourseEnrollment);
router.get("/course-enrollment/:userId/:courseId", GetCourseEnrollment);
router.delete("/course-enrollment/:id", DeleteCourseEnrollment);
router.post("/completed-lesson", CompletedLesson);
router.delete("/completed-lesson/:id", DeleteCompletedLesson);

export default router;
