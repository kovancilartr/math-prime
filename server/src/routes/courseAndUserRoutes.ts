import express from "express";
import {
  CompletedLesson,
  CourseEnrollment,
  DeleteCompletedLesson,
  DeleteCourseEnrollment,
  GetCourseEnrollment,
} from "../controllers/courseAndUserController";

const router = express.Router();

router.post("/course-enrollment", CourseEnrollment);
router.get("/course-enrollment/:userId/:courseId", GetCourseEnrollment);
router.delete("/course-enrollment/:id", DeleteCourseEnrollment);
router.post("/completed-lesson", CompletedLesson);
router.delete("/completed-lesson/:id", DeleteCompletedLesson);

export default router;
