"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseController_1 = require("../controllers/courseController");
const router = express_1.default.Router();
router.get("/get-courses", courseController_1.getCourses); // GET-Request
router.post("/create-course", courseController_1.createCourse); // POST-Request
router.put("/edit-course", courseController_1.editCourse); // PUT-Request
router.delete("/delete-course/:id", courseController_1.deleteCourse); // DELETE-Request
exports.default = router;
