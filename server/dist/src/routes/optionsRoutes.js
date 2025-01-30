"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const optionsController_1 = require("../controllers/optionsController");
const router = express_1.default.Router();
router.get("/get-options", optionsController_1.getOptions);
router.post("/create-option", optionsController_1.createOption);
router.put("/edit-option", optionsController_1.editOption);
router.delete("/delete-option/:id", optionsController_1.deleteOption);
exports.default = router;
