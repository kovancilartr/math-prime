import express from "express";
import {
  deleteUser,
  editUser,
  getAllUsers,
  login,
  logout,
  refreshAccessToken,
  register,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logout);
router.get("/all-users", getAllUsers);
router.put("/edit-user", editUser);
router.delete("/delete-user", deleteUser);

export default router;
