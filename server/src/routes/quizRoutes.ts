import express from "express";
import {
  createQuiz,
  deleteQuiz,
  editQuiz,
  getQuizzes,
} from "../controllers/quizCountroller";

const router = express.Router();

router.get("/get-quizzes", getQuizzes);
router.post("/create-quiz", createQuiz);
router.put("/edit-quiz", editQuiz);
router.delete("/delete-quiz/:id", deleteQuiz);

export default router;
