"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.post("/register", authController_1.register);
router.post("/login", authController_1.login);
router.post("/refresh-token", authController_1.refreshAccessToken);
router.post("/logout", authController_1.logout);
router.get("/all-users", authController_1.getAllUsers);
router.put("/edit-user", authController_1.editUser);
router.delete("/delete-user", authController_1.deleteUser);
exports.default = router;
