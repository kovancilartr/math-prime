import express from "express";
import {
  createChapter,
  deleteChapter,
  editChapter,
  getChapters,
} from "../controllers/chapterController";

const router = express.Router();

router.get("/get-chapters", getChapters);
router.post("/create-chapter", createChapter);
router.put("/edit-chapter", editChapter);
router.delete("/delete-chapter/:id", deleteChapter);

export default router;
