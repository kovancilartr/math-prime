"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chapterController_1 = require("../controllers/chapterController");
const router = express_1.default.Router();
router.get("/get-chapters", chapterController_1.getChapters);
router.post("/create-chapter", chapterController_1.createChapter);
router.put("/edit-chapter", chapterController_1.editChapter);
router.delete("/delete-chapter/:id", chapterController_1.deleteChapter);
router.post("/complete-chapter", chapterController_1.completeChapter);
router.delete("/delete-completed-chapter/:chapterId/:userId", chapterController_1.deleteCompletedChapter);
exports.default = router;
