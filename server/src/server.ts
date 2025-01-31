import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import Routes
import authRoutes from "./routes/authRoutes";
import courseRoutes from "./routes/courseRoutes";
import sectionRoutes from "./routes/sectionRoutes";
import chapterRoutes from "./routes/chapterRoutes";
import quizRoutes from "./routes/quizRoutes";
import questionRoutes from "./routes/questionRoutes";
import optionsRoutes from "./routes/optionsRoutes";
import courseAndUserRoutes from "./routes/courseAndUserRoutes";
import categoryRoutes from "./routes/categoryRoutes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: ["https://math-prime-client.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

export const prisma = new PrismaClient();

app.use("/api/auth", authRoutes);
app.use("/api/v1", courseRoutes);
app.use("/api/v1", sectionRoutes);
app.use("/api/v1", chapterRoutes);
app.use("/api/v1", quizRoutes);
app.use("/api/v1", questionRoutes);
app.use("/api/v1", optionsRoutes);
app.use("/api/v1", courseAndUserRoutes);
app.use("/api/v1", categoryRoutes);

app.get("/", (req, res) => {
  res.send("Hello Backend API...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
