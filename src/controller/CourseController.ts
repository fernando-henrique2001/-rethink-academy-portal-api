import { Request, Response } from "express";
import { prismaInstance, Roles } from "../../database/prismaClient";

const create = async (request: Request, response: Response) => {
  const {
    name,
    description,
    level,
    workload,
    learning,
    skills,
    trailId,
    imageTeacher,
    teacherDescription,
    teacherName,
    courseStyle,
  } = request.body;
  try {
    const course = await prismaInstance.course.create({
      data: {
        name,
        description,
        level,
        workload,
        learning,
        skills,
        trailId,
        imageTeacher,
        teacherDescription,
        teacherName,
        courseStyle,
      },
    });
    return response
      .status(201)
      .json({ course, message: "Curso criado com sucesso" });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getCoursesByTrailId = async (request: Request, response: Response) => {
  const { trailId } = request.params;

  const { email }: { email?: string } = request.query;

  try {
    const courses = await prismaInstance.trail.findUnique({
      where: { id: trailId },
      select: {
        name: true,
        main: true,
        course: {
          include: {
            modules: {
              select: {
                lessons: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const trailName = courses?.name;
    const trailMain = courses?.main;

    if (!email) throw new Error("Não vem email");

    const user = await prismaInstance.user.findFirst({
      where: { email },
      include: {
        badges: true,
      },
    });

    let courseBegining = false;
    let courseIsCompleted = true;
    let coursecompleted = 0;
    let badgeCompleted: boolean = false;

    const badgesUser = await prismaInstance.badges.findFirstOrThrow({
      where: { userId: user?.id },
    });

    const data = courses?.course.map((course) => {
      courseBegining = false;
      courseIsCompleted = true;
      coursecompleted = 0;
      badgeCompleted = false;

      course.modules.map((module) => {
        module.lessons.map((lesson) => {
          if (user?.watched.includes(lesson.id)) {
            courseBegining = true;
          } else {
            courseIsCompleted = false;
          }
        });
      });
      if (courseIsCompleted === true) coursecompleted = 1;
      else if (courseBegining) coursecompleted = 2;
      else coursecompleted = 3;

      const badge = courses.main.toLowerCase();

      if (!badgesUser) throw new Error("User nao tem badges");
      if (!badgesUser[badge]) throw new Error(`User nao tem badge ${badge}`);

      console.log(badgeCompleted);
      if (badgesUser[badge].includes(course.id)) {
        badgeCompleted = true;
      }

      return {
        ...course,
        coursecompleted,
        badgeCompleted,
      };
    });

    return response.status(200).json({ user, trailName, data, trailMain });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getById = async (request: Request, response: Response) => {
  const { id } = request.params;
  try {
    const course = await prismaInstance.course.findFirst({
      where: { id },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
        trail: {
          select: {
            name: true,
          },
        },
      },
    });

    return response.status(200).json({ course });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getAll = async (request: Request, response: Response) => {
  try {
    const course = await prismaInstance.course.findMany();

    return response.status(200).json({ course });
  } catch (error) {
    return response
      .status(400)
      .json({
        message: "Algo de errado aconteceu aqui.",
        error: error.message,
      });
  }
};
const getCourse = async (request: Request, response: Response) => {
  const { courseId, email } = request.params;

  try {
    const course = await prismaInstance.course.findUnique({
      where: { id: courseId },
      include: {
        trail: {
          select: {
            name: true,
          },
        },
      },
    });
    const modules = await prismaInstance.module.findMany({
      where: { courseId },
      select: {
        id: true,
        name: true,
        lessons: {
          select: {
            id: true,
            name: true,
            embedUrl: true,
            description: true,
          },
        },
      },
      orderBy: {
        cratedAt: "asc",
      },
    });

    const user = await prismaInstance.user.findFirst({
      where: { email },
      select: {
        role: true,
        watched: true,
      },
    });

    if (user!.role === ("AMBASSADOR" as Roles)) {
      return response.status(200).json({ course, modules, role: user!.role });
    } else {
      const courseModules = [{}];
      courseModules.shift();

      modules!.map((module, index) => {
        let blocked = false;
        const completed = moduleCompleted(module, user?.watched);
        if (index > 0) {
          if (
            !moduleCompleted(modules[index - 1], user?.watched) ||
            modules[index - 1].lessons.length === 0
          ) {
            blocked = true;
            module.lessons = [];
          }
        }
        courseModules.push({
          ...module!,
          blocked,
          completed,
        });
      });

      return response.status(200).json({
        course,
        modules: courseModules,
        role: user!.role,
        watched: user?.watched,
      });
    }
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};
const moduleCompleted = (module, watched) => {
  let completed = true;
  module.lessons.forEach((element) => {
    if (!watched.includes(element.id)) {
      completed = false;
    }
  });
  return completed;
};

const getCourseModules = async (request: Request, response: Response) => {
  const { id } = request.params;
  console.log(id);

  try {
    const modules = await prismaInstance.module.findMany({
      where: {
        courseId: {
          equals: id,
        },
      },
      select: {
        id: true,
        name: true,
        lessons: true,
      },
    });
    return response.status(200).json({ modules });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const update = async (request: Request, response: Response) => {
  const {
    name,
    description,
    level,
    workload,
    learning,
    skills,
    trailId,
    imageTeacher,
    teacherDescription,
    teacherName,
    courseStyle,
  } = request.body;
  const { id } = request.params;
  try {
    const course = await prismaInstance.course.update({
      where: { id },
      data: {
        name,
        description,
        level,
        workload,
        learning,
        skills,
        trailId,
        imageTeacher,
        teacherDescription,
        teacherName,
        courseStyle,
      },
    });
    return response
      .status(200)
      .json({ course, message: "Curso atualizado com sucesso" });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const deleteById = async (request: Request, response: Response) => {
  const { id } = request.params;
  try {
    const course = await prismaInstance.course.delete({
      where: { id },
    });

    return response
      .status(200)
      .json({ course, message: "Curso deletado com sucesso" });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getProgress = async (request: Request, response: Response) => {
  const trailId = request.params.id;

  try {
    const courses = await prismaInstance.course.findMany({
      where: { trailId },
      select: {
        id: true,
        name: true,

        modules: {
          select: {
            id: true,
            courseId: true,
            lessons: {
              select: {
                id: true,
                moduleId: true,
              },
            },
          },
        },
      },
    });

    let modulesQnt = 0;
    courses.map((course) => {
      modulesQnt += course.modules.length;
    });
    // console.log(courses);
    const users = await prismaInstance.user.findMany({
      where: { role: "STUDENT" },
      select: {
        name: true,
        surname: true,
        watched: true,
        role: true,
        avatar: true,
      },
    });

    const usersProgress = users.map((user) => {
      let completedModules: string[] = [];
      let moduleCompleted: boolean;

      courses.map((course) => {
        course.modules.map((module) => {
          module.lessons.length !== 0
            ? (moduleCompleted = true)
            : (moduleCompleted = false);

          module.lessons.map((lesson) => {
            if (!user.watched.includes(lesson.id)) {
              moduleCompleted = false;
            }
          });

          moduleCompleted && completedModules.push(module.id);
          // console.log(module.id);
        });
      });

      return {
        userName: user.name + " " + user.surname,
        userImage:
          user.avatar ??
          `https://ui-avatars.com/api/?name=${user.name}+${user.surname}`,
        completedModules,
      };
    });
    return response.status(200).json({ courses, modulesQnt, usersProgress });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

export default {
  create,
  getCoursesByTrailId,
  update,
  deleteById,
  getById,
  getCourseModules,
  getProgress,
  getAll,
  getCourse,
};
