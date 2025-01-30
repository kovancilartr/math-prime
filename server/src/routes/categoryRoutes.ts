import express from "express";
import { getCategories } from "../controllers/categoryController";

const router = express.Router();

router.get("/get-categories", getCategories); // GET-Request

export default router;
