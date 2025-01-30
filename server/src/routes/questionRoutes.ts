import express from "express";
import {
  createQuestion,
  deleteQuestion,
  editQuestion,
  getQuestions,
} from "../controllers/questionController";

const router = express.Router();

router.get("/get-questions", getQuestions);
router.post("/create-question", createQuestion);
router.put("/edit-question", editQuestion);
router.delete("/delete-question/:id", deleteQuestion);

export default router;
