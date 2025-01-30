import express from "express";
import {
  createOption,
  deleteOption,
  editOption,
  getOptions,
} from "../controllers/optionsController";

const router = express.Router();

router.get("/get-options", getOptions);
router.post("/create-option", createOption);
router.put("/edit-option", editOption);
router.delete("/delete-option/:id", deleteOption);

export default router;
