"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sectionController_1 = require("../controllers/sectionController");
const router = express_1.default.Router();
router.get("/get-sections", sectionController_1.getSections);
router.post("/create-section", sectionController_1.createSection);
router.put("/edit-section", sectionController_1.editSection);
router.delete("/delete-section/:id", sectionController_1.deleteSection);
exports.default = router;
