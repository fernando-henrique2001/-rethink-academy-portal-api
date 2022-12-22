import { application, Request, Response } from "express";
import { prismaInstance } from "../../database/prismaClient";
import { differenceInDays } from "date-fns";

const levelMaker = () => {
  let level = 0;
  let startLevel = new Date(2022, 2, 7);
  let endLevel = new Date(2022, 8, 22).getTime();
  const between = differenceInDays(new Date(), startLevel);
  let timeNow = new Date(2022, 4, 1).getHours();
  let hoursNow = new Date().getHours();
  let rex: number = between * 24 + timeNow;
  level = Math.trunc(rex / 48);
  let exp = (rex + hoursNow) % 48;
  if (endLevel < new Date().getTime()) {
    level = 100;
  }
  return {
    level,
    exp,
  };
};

const create = async (request: Request, response: Response) => {
  const { email, role, name, surname, main, avatar, receiveGIF } = request.body;
  try {
    if (!email) {
      return response
        .status(400)
        .json({ message: "Campo email é obrigatorio." });
    }
    const user = await prismaInstance.user.create({
      data: {
        name,
        surname,
        email,
        main,
        role,
        receiveGIF,
        avatar: avatar || `https://ui-avatars.com/api/?name=${name}+${surname}`,
      },
    });

    return response
      .status(200)
      .json({ user, message: "Usuário criado com sucesso" });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getAll = async (request: Request, response: Response) => {
  try {
    const {
      main,
      role,
    }: {
      main?: "ENGINEERING" | "DESIGN" | "PRODUCT";
      role?: "STUDENT" | "AMBASSADOR" | "RETHINKER";
    } = request.query;

    const users = await prismaInstance.user.findMany({
      where: { main, role },
    });
    const userWithLevel = users.map((item) => {
      return {
        ...item,
        ...levelMaker(),
      };
    });
    return response.status(200).json(userWithLevel);
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getUserByEmail = async (request: Request, response: Response) => {
  const { email } = request.params;
  console.log({ params: request.params });

  try {
    const user = await prismaInstance.user.findUnique({
      where: { email },
    });
    if (!user) throw new Error("Usuário não encontrado");
    const userWithLevel = { ...user, ...levelMaker() };

    return response.status(200).json(userWithLevel);
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const update = async (request: Request, response: Response) => {
  try {
    const {
      role,
      name,
      surname,
      main,
      avatar,
      receiveGIF,
    }: {
      email: string;
      role?: "STUDENT" | "AMBASSADOR" | "RETHINKER";
      name?: string;
      surname?: string;
      avatar?: string;
      main?: "ENGINEERING" | "DESIGN" | "PRODUCT";
      receiveGIF?: string;
    } = request.body;
    const email: string = request.params.email;
    const updatedUser = await prismaInstance.user.update({
      where: {
        email,
      },
      data: {
        role,
        name,
        surname,
        main,
        avatar,
        receiveGIF,
      },
    });

    return response.status(200).json(updatedUser);
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const createWatched = async (request: Request, response: Response) => {
  const { email } = request.params;
  const { watchedId } = request.body;

  try {
    const user = await prismaInstance.user.findUnique({
      where: { email },
      select: {
        watched: true,
      },
    });

    user?.watched.push(watchedId);

    const userUpdated = await prismaInstance.user.update({
      where: { email },
      data: {
        watched: user?.watched,
      },
    });

    return response.status(200).json(userUpdated);
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getWatched = async (request: Request, response: Response) => {
  const { email } = request.params;
  try {
    const user = await prismaInstance.user.findFirst({
      where: { email },
    });

    const { trailId }: { trailId?: string } = request.query;
    const courses = await prismaInstance.course.findMany({
      where: { trailId },
      // select: {
      //   courseStyle: true,
      //   trail: true,
      //   modules: {
      //     include: {
      //       lessons: true,
      //     },
      //   },
      // },
      include: {
        trail: true,
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    const maxLessons = courses.map((course) => {
      const lessonsLength: any = [];
      const userLessonsLength: any = [];

      course.modules.map((module) => {
        module.lessons.map((lesson) => {
          if (user?.watched.includes(lesson.id)) {
            userLessonsLength.push(lesson.id);
          }
          lessonsLength.push(lesson.id);
        });
      });

      let completed: boolean = false;
      if (
        lessonsLength.length !== 0 &&
        lessonsLength.length == userLessonsLength.length
      ) {
        completed = true;
      }

      return {
        courseStyle: course.courseStyle,
        lessonsLength: lessonsLength.length,
        userLessonsLength: userLessonsLength.length,
        completed,
        name: course.name,
        id: course.id,
        trail: course.trail,
      };
    });

    return response.status(200).json({ maxLessons, user });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getWatchedList = async (request: Request, response: Response) => {
  const { email } = request.params;
  try {
    const watchedList = await prismaInstance.user.findUnique({
      where: { email },
      select: {
        watched: true,
      },
    });

    return response.status(200).json(watchedList);
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const updateLessonsWatched = async (request: Request, response: Response) => {
  const { watched } = request.body;

  const { email } = request.params;
  try {
    const user = await prismaInstance.user.update({
      where: { email },
      data: {
        watched,
      },
    });
    return response
      .status(200)
      .json({ user, message: "Lições completadas pelo usuário!" });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

export default {
  create,
  getUserByEmail,
  createWatched,
  getWatched,
  getWatchedList,
  getAll,
  update,
  levelMaker,
  updateLessonsWatched,
  // updateLessonsWatched,
};
