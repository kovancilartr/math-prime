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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Start seeding...");
        // Create Users
        const user1 = yield prisma.user.create({
            data: {
                name: "John",
                surname: "Doe",
                email: "john.doe@example.com",
                password: "password123",
                role: "USER",
            },
        });
        const user2 = yield prisma.user.create({
            data: {
                name: "Jane",
                surname: "Smith",
                email: "jane.smith@example.com",
                password: "password456",
                role: "SUPER_ADMIN",
            },
        });
        // Create Courses
        for (let i = 1; i <= 3; i++) {
            const course = yield prisma.course.create({
                data: {
                    title: `Course ${i}`,
                    description: `This is the description for Course ${i}`,
                    price: 99.99 + i,
                    thumbnail: `https://placekitten.com/300/200?course=${i}`,
                    instructor: {
                        connect: { id: user1.id }, // Assign user1 as the instructor
                    },
                },
            });
            // Create Sections for each Course
            for (let j = 1; j <= 2; j++) {
                const section = yield prisma.section.create({
                    data: {
                        title: `Section ${j} of Course ${i}`,
                        course: { connect: { id: course.id } },
                    },
                });
                // Create Chapters for each Section
                for (let k = 1; k <= 4; k++) {
                    yield prisma.chapter.create({
                        data: {
                            title: `Chapter ${k} of Section ${j} in Course ${i}`,
                            videoUrl: `https://example.com/video/course${i}_section${j}_chapter${k}`,
                            pdfUrl: `https://example.com/pdf/course${i}_section${j}_chapter${k}.pdf`,
                            section: { connect: { id: section.id } },
                        },
                    });
                }
            }
            // Enroll User2 into each Course
            yield prisma.courseEnrollment.create({
                data: {
                    user: { connect: { id: user2.id } },
                    course: { connect: { id: course.id } },
                },
            });
            // Add Ratings for the Course
            yield prisma.rating.create({
                data: {
                    rating: 4.5,
                    review: `Great course ${i}!`,
                    user: { connect: { id: user2.id } },
                    course: { connect: { id: course.id } },
                },
            });
        }
        console.log("Seeding finished.");
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
