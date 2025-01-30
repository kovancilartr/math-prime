import express from "express";
import {
  createSection,
  deleteSection,
  editSection,
  getSections,
} from "../controllers/sectionController";

const router = express.Router();

router.get("/get-sections", getSections);
router.post("/create-section", createSection);
router.put("/edit-section", editSection);
router.delete("/delete-section/:id", deleteSection);

export default router;
