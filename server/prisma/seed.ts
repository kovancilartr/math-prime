import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      name: "John",
      surname: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      role: "USER",
    },
  });

  const user2 = await prisma.user.create({
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
    const course = await prisma.course.create({
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
      const section = await prisma.section.create({
        data: {
          title: `Section ${j} of Course ${i}`,
          course: { connect: { id: course.id } },
        },
      });

      // Create Chapters for each Section
      for (let k = 1; k <= 4; k++) {
        await prisma.chapter.create({
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
    await prisma.courseEnrollment.create({
      data: {
        user: { connect: { id: user2.id } },
        course: { connect: { id: course.id } },
      },
    });

    // Add Ratings for the Course
    await prisma.rating.create({
      data: {
        rating: 4.5,
        review: `Great course ${i}!`,
        user: { connect: { id: user2.id } },
        course: { connect: { id: course.id } },
      },
    });
  }

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
