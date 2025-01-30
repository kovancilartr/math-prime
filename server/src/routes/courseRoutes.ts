import express from "express";
import {
  createCourse,
  deleteCourse,
  editCourse,
  getCourses,
} from "../controllers/courseController";

const router = express.Router();

router.get("/get-courses", getCourses); // GET-Request
router.post("/create-course", createCourse); // POST-Request
router.put("/edit-course", editCourse); // PUT-Request
router.delete("/delete-course/:id", deleteCourse); // DELETE-Request

export default router;
