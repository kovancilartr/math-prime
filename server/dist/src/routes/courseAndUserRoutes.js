"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseAndUserController_1 = require("../controllers/courseAndUserController");
const router = express_1.default.Router();
router.post("/course-enrollment", courseAndUserController_1.CourseEnrollment);
router.get("/course-enrollment/:userId/:courseId", courseAndUserController_1.GetCourseEnrollment);
router.delete("/course-enrollment/:id", courseAndUserController_1.DeleteCourseEnrollment);
router.post("/completed-lesson", courseAndUserController_1.CompletedLesson);
router.delete("/completed-lesson/:id", courseAndUserController_1.DeleteCompletedLesson);
exports.default = router;
