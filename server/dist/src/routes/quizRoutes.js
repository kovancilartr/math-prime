"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quizCountroller_1 = require("../controllers/quizCountroller");
const router = express_1.default.Router();
router.get("/get-quizzes", quizCountroller_1.getQuizzes);
router.post("/create-quiz", quizCountroller_1.createQuiz);
router.put("/edit-quiz", quizCountroller_1.editQuiz);
router.delete("/delete-quiz/:id", quizCountroller_1.deleteQuiz);
exports.default = router;
