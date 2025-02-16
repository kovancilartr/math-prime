import express from "express";
import {
  createChapter,
  deleteChapter,
  editChapter,
  getChapters,
  completeChapter,
  deleteCompletedChapter,
} from "../controllers/chapterController";

const router = express.Router();

router.get("/get-chapters", getChapters);
router.post("/create-chapter", createChapter);
router.put("/edit-chapter", editChapter);
router.delete("/delete-chapter/:id", deleteChapter);
router.post("/complete-chapter", completeChapter);
router.delete("/delete-completed-chapter/:chapterId/:userId", deleteCompletedChapter);

export default router;
