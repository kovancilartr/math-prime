"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// Import Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
const sectionRoutes_1 = __importDefault(require("./routes/sectionRoutes"));
const chapterRoutes_1 = __importDefault(require("./routes/chapterRoutes"));
const quizRoutes_1 = __importDefault(require("./routes/quizRoutes"));
const questionRoutes_1 = __importDefault(require("./routes/questionRoutes"));
const optionsRoutes_1 = __importDefault(require("./routes/optionsRoutes"));
const courseAndUserRoutes_1 = __importDefault(require("./routes/courseAndUserRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const corsOptions = {
    origin: ["https://math-prime-client.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
exports.prisma = new client_1.PrismaClient();
app.use("/api/auth", authRoutes_1.default);
app.use("/api/v1", courseRoutes_1.default);
app.use("/api/v1", sectionRoutes_1.default);
app.use("/api/v1", chapterRoutes_1.default);
app.use("/api/v1", quizRoutes_1.default);
app.use("/api/v1", questionRoutes_1.default);
app.use("/api/v1", optionsRoutes_1.default);
app.use("/api/v1", courseAndUserRoutes_1.default);
app.use("/api/v1", categoryRoutes_1.default);
app.get("/", (req, res) => {
    res.send("Hello Backend API...");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.prisma.$disconnect();
    process.exit();
}));
