import { PrismaClient } from "@prisma/client";
import {
  users,
  trails,
  courses,
  modules,
  timeLine,
  tasksData,
} from "./seedData";
const prisma = new PrismaClient();

// async function main() {
//   timeLine.forEach(async (timeLine) => {
//     await prisma.courseTimeline.create({
//       data: {
//         content: timeLine.content,
//         finish: timeLine.finish,
//         start: timeLine.start,
//         stage: timeLine.stage,
//         trailId: "473e7285-4fbc-472d-9939-bf52b846af36",
//       },
//     });
//   });
// }
async function main() {
  const newTrail = trails.map(async (trail) => {
    return await prisma.trail.create({
      data: {
        name: trail.name,
        description: trail.description,
        weight: trail.weight,
        main: trail.main,
        imageUrl: trail.imageUrl,
      },
    });
  });

  if ((await newTrail[1]).id) {
    const newCourses = await prisma.course.create({
      data: {
        name: courses.name,
        description: courses.description,
        level: courses.level,
        workload: courses.workload,
        skills: courses.skills,
        learning: courses.learning,
        courseStyle: courses.courseStyle,
        imageTeacher: courses.imageTeacher,
        teacherDescription: courses.teacherDescription,
        teacherName: courses.teacherName,
        trailId: (await newTrail[1]).id,
      },
    });

    const newModules = await prisma.module.create({
      data: {
        name: modules.name,
        courseId: newCourses.id,
      },
    });
    const newLesson = await prisma.lesson.create({
      data: {
        name: "o que é UX Design? (07:50)",
        embedUrl: "https://www.loom.com/embed/880284f2e0354526a6cc9da4812d5e11",
        description:
          "Aprenda a executar pesquisas de UX Design, fazer testes de usabilidade e elaborar análises, além de utilizar frameworks e métodos para a criação de designs de qualidade e que ofereçam uma boa experiência ao usuário. Ao concluir as aulas, você estará pronto para definir processos e construir frameworks baseados em estudos sobre as necessidades dos usuários, seus objetivos, habilidades e limitações, para alcançar os objetivos de negócios.",

        moduleId: newModules.id,
      },
    });
  }
  users.forEach(async ({ email, name, surname, main, role }) => {
    const newUser = await prisma.user.upsert({
      where: {
        email: email,
      },
      update: {
        name: name,
        surname: surname,
        main: main,
        role: role ?? "STUDENT",
      },
      create: {
        name: name,
        surname: surname,
        email: email,
        main: main,
        role: role ?? "STUDENT",
        avatar: `https://ui-avatars.com/api/?name=${name}+${surname}`,
      },
    });
    await prisma.badges.upsert({
      where: {
        userId: newUser.id,
      },
      update: {},
      create: {
        userId: newUser.id,
      },
    });
    await prisma.info.upsert({
      where: {
        userId: newUser.id,
      },
      update: {},
      create: {
        userId: newUser.id,
      },
    });
    tasksData.forEach((item) =>
      prisma.tasks.create({
        data: { ...item, userId: newUser.id },
      })
    );
  });
  await prisma.$disconnect();
  console.log("Seeders generated");
  console.timeEnd();
}

main();
