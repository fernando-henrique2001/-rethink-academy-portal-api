import { Request, Response } from "express";
import { userInfo } from "os";
import { prismaInstance } from "../../database/prismaClient";
import {
  timeKeeper,
  convertMonth,
  addDayToEndDate,
  timeToString,
  convertTime,
  TasksProps,
  TasksPropsUpdate,
  composeDate,
} from "../helpers/dateTimeHelpers";

const getSingleTask = async (request: Request, response: Response) => {
  try {
    const task = await prismaInstance.tasks.findFirst({
      where: { id: request.params.id },
    });
    return response.status(200).json(task);
  } catch (error) {
    console.log(error);
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getTaskByUserEmail = async (request: Request, response: Response) => {
  try {
    const { email } = request.params;
    const { startDate, endDate }: { startDate?: Date; endDate?: Date } =
      request.body;

    const user = await prismaInstance.user.findFirst({
      where: { email },
    });
    let AND: any = [];
    if (email) {
      AND.push({ userId: user!.id });
    }

    if (startDate && endDate) {
      AND.push({ taskDate: { gte: new Date(startDate) } });
      AND.push({ taskDate: { lte: addDayToEndDate(endDate) } });
    }

    const tasks = await prismaInstance.tasks.findMany({
      orderBy: { taskDate: "asc" },
      where: {
        AND,
      },
    });

    let helper = {};
    tasks.map((task) => {
      if (
        !helper[task.taskDate.toLocaleDateString("pt-BR", { timeZone: "UTC" })]
      ) {
        helper[task.taskDate.toLocaleDateString("pt-BR", { timeZone: "UTC" })] =
          [];
      }

      helper[
        task.taskDate.toLocaleDateString("pt-BR", { timeZone: "UTC" })
      ].push({
        ...task,
        duration: timeToString(
          timeKeeper(task.endTime) - timeKeeper(task.startTime)
        ),
        taskDate: convertMonth(task.taskDate.toISOString()),
        realTaskDate: task.taskDate.toISOString(),
      });
    });

    const studentTasks: any = [];
    for (const key in helper) {
      studentTasks.push(helper[key]);
    }

    return response.status(200).json(studentTasks);
  } catch (error) {
    console.log(error);
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const createTask = async (request: Request, response: Response) => {
  try {
    const {
      name,
      taskDate,
      startTime,
      endTime,
      tags,
      status,
      description,
      userEmail,
    }: TasksProps = request.body;
    if (!userEmail) throw new Error("Email obrigatório");

    const user = await prismaInstance.user.findFirst({
      where: { email: userEmail },
    });
    if (!user) throw new Error("Usuário não encontrado");

    const task = await prismaInstance.tasks.create({
      data: {
        name,
        taskDate,
        startTime,
        endTime,
        tags,
        status,
        description,
        userId: user.id,
      },
    });

    return response.status(200).json({
      task,
      message: `Task criado com sucesso para o user: ${user.id}`,
    });
  } catch (error) {
    console.log({ error });
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const removeTask = async (request: Request, response: Response) => {
  const { id } = request.params;
  try {
    await prismaInstance.tasks.delete({
      where: { id },
    });

    return response.status(200).json({ message: "Task deletada com sucesso." });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const updateTask = async (request: Request, response: Response) => {
  const { id } = request.params;
  const {
    name,
    taskDate,
    startTime,
    endTime,
    tags,
    status,
    description,
  }: TasksPropsUpdate = request.body;

  try {
    for (const key in request.body) {
      if (!request.body[key]) {
        throw new Error(`Você precisa enviar : ${key}`);
      }
    }
    const verify = await prismaInstance.tasks.findFirst({
      where: { id },
    });
    if (!verify) throw new Error("task not found");
    const task = await prismaInstance.tasks.update({
      where: { id },
      data: {
        name,
        taskDate,
        startTime,
        endTime,
        tags,
        status,
        description,
      },
    });

    return response.status(200).json(task);
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getGroupTaskByTag = async (request: Request, response: Response) => {
  try {
    const { email }: { email?: string } = request.params;

    const currentDate = new Date();

    if (!email) throw new Error("Email obrigatório");

    const user = await prismaInstance.user.findFirst({
      where: { email },
    });
    if (!user) throw new Error("Usuário não encontrado");

    let AND: any = [];
    if (email) {
      AND.push({ userId: user!.id });
    }

    const currentMonth = (new Date(currentDate).getMonth() + 1).toString();
    const currentYear = new Date(currentDate).getFullYear().toString();

    const startDate = composeDate("01", currentMonth, currentYear);
    const lastDay = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      0
    )
      .getDate()
      .toString();

    const endDate = composeDate(lastDay, currentMonth, currentYear);

    AND.push({ taskDate: { gte: new Date(startDate) } });
    AND.push({ taskDate: { lte: new Date(endDate) } });

    const groupTasks = await prismaInstance.tasks.findMany({
      where: {
        AND,
      },
    });

    let helper = {};
    groupTasks.forEach((item) => {
      if (helper[item.tags]) {
        helper[item.tags].realTime +=
          timeKeeper(item.endTime) - timeKeeper(item.startTime);
      } else {
        helper[item.tags] = {};
        helper[item.tags].realTime =
          timeKeeper(item.endTime) - timeKeeper(item.startTime);
      }
    });

    const arrayHelper: any[] = [];

    for (const key in helper) {
      arrayHelper.push({
        title: key,
        realTime: helper[key].realTime,
        ...convertTime(helper[key].realTime),
      });
    }

    return response.status(200).json(arrayHelper);
  } catch (error) {
    console.log(error);
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getRecordOfDay = async (request: Request, response: Response) => {
  try {
    const { email }: { email?: string } = request.params;

    if (!email) throw new Error("Email obrigatório");

    const user = await prismaInstance.user.findFirst({
      where: { email },
    });
    if (!user) throw new Error("Usuário não encontrado");

    let AND: any = [];
    if (email) {
      AND.push({ userId: user!.id });
    }

    const date = new Date();
    const modifiedDate = new Date(
      date.valueOf() - date.getTimezoneOffset() * 60000
    );

    const separateDate = modifiedDate
      .toLocaleDateString("pt-BR", { timeZone: "UTC" })
      .split("/");

    const startDate = composeDate(
      separateDate[0],
      separateDate[1],
      separateDate[2]
    );
    const endDate = composeDate(
      (parseInt(separateDate[0]) + 1).toString(),
      separateDate[1],
      separateDate[2]
    );

    AND.push({ taskDate: { gte: startDate } });
    AND.push({ taskDate: { lte: endDate } });

    const recordsDay = await prismaInstance.tasks.findMany({
      orderBy: [
        {
          status: "desc",
        },
      ],
      where: {
        AND,
      },
    });

    const arrayHelper: any[] = [];

    for (const key in recordsDay) {
      arrayHelper.push({
        id: recordsDay[key].id,
        name: recordsDay[key].name,
        status: recordsDay[key].status,
        time:
          timeKeeper(recordsDay[key].endTime) -
          timeKeeper(recordsDay[key].startTime),
        ...convertTime(
          timeKeeper(recordsDay[key].endTime) -
            timeKeeper(recordsDay[key].startTime)
        ),
      });
    }

    return response.status(200).json(arrayHelper);
  } catch (error) {
    console.log(error);
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getHoursLastDay = async (request: Request, response: Response) => {
  try {
    const { email }: { email?: string } = request.params;

    if (!email) throw new Error("Email obrigatório");

    const user = await prismaInstance.user.findFirst({
      where: { email },
    });
    if (!user) throw new Error("Usuário não encontrado");

    let AND: any = [];
    if (email) {
      AND.push({ userId: user!.id });
    }

    const date = new Date();
    const modifiedDate = new Date(
      date.valueOf() - date.getTimezoneOffset() * 60000
    );

    let month = (modifiedDate.getMonth() + 1).toString();
    let day = (modifiedDate.getDate() - 1).toString();
    let year = modifiedDate.getFullYear().toString();

    if (parseInt(month, 10) < 10) {
      month = "0" + month;
    }
    if (parseInt(day, 10) < 10) {
      day = "0" + day;
    }

    const startDate = [year, month, day].join("-") + "T00:00:00.000Z";
    const endDate = [year, month, day].join("-") + "T23:59:59.000Z";

    AND.push({ taskDate: { gte: startDate } });
    AND.push({ taskDate: { lte: endDate } });

    const recordsDay = await prismaInstance.tasks.findMany({
      orderBy: [
        {
          status: "desc",
        },
      ],
      where: {
        AND,
      },
    });

    const arrayHelper: any[] = [];

    for (const key in recordsDay) {
      arrayHelper.push({
        id: recordsDay[key].id,
        name: recordsDay[key].name,
        status: recordsDay[key].status,
        time:
          timeKeeper(recordsDay[key].endTime) -
          timeKeeper(recordsDay[key].startTime),
        ...convertTime(
          timeKeeper(recordsDay[key].endTime) -
            timeKeeper(recordsDay[key].startTime)
        ),
      });
    }

    let hours = 0;
    arrayHelper.map((task) => (hours += task.time));

    hours = hours / 60;

    return response.status(200).json({ hours, user });
  } catch (error) {
    console.log(error);
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getHoursOfThreeLastDays = async (
  request: Request,
  response: Response
) => {
  try {
    const { email }: { email?: string } = request.params;

    if (!email) throw new Error("Email obrigatório");

    const user = await prismaInstance.user.findFirst({
      where: { email },
    });
    if (!user) throw new Error("Usuário não encontrado");

    let AND: any = [];
    if (email) {
      AND.push({ userId: user!.id });
    }

    const date = new Date();
    const modifiedDate = new Date(
      date.valueOf() - date.getTimezoneOffset() * 60000
    );

    let month = (modifiedDate.getMonth() + 1).toString();
    let startDay = (modifiedDate.getDate() - 3).toString();
    let endDay = (modifiedDate.getDate() - 1).toString();
    let year = modifiedDate.getFullYear().toString();

    if (parseInt(month, 10) < 10) {
      month = "0" + month;
    }
    if (parseInt(startDay, 10) < 10) {
      startDay = "0" + startDay;
    }
    if (parseInt(endDay, 10) < 10) {
      endDay = "0" + endDay;
    }

    const startDate = [year, month, startDay].join("-") + "T00:00:00.000Z";
    const endDate = [year, month, endDay].join("-") + "T23:59:59.000Z";

    console.log(startDate, endDate);

    AND.push({ taskDate: { gte: startDate } });
    AND.push({ taskDate: { lte: endDate } });

    const recordsDay = await prismaInstance.tasks.findMany({
      orderBy: [
        {
          status: "desc",
        },
      ],
      where: {
        AND,
      },
    });

    const arrayHelper: any[] = [];

    for (const key in recordsDay) {
      arrayHelper.push({
        id: recordsDay[key].id,
        name: recordsDay[key].name,
        status: recordsDay[key].status,
        time:
          timeKeeper(recordsDay[key].endTime) -
          timeKeeper(recordsDay[key].startTime),
        ...convertTime(
          timeKeeper(recordsDay[key].endTime) -
            timeKeeper(recordsDay[key].startTime)
        ),
      });
    }

    let hours = 0;
    arrayHelper.map((task) => (hours += task.time));

    hours = hours / 60;

    return response.status(200).json({ hours, user });
  } catch (error) {
    console.log(error);
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getHoursOfMonth = async (request: Request, response: Response) => {
  try {
    const { email }: { email?: string } = request.params;

    const currentDate = new Date();

    if (!email) throw new Error("Email obrigatório");

    const user = await prismaInstance.user.findFirst({
      where: { email },
    });
    if (!user) throw new Error("Usuário não encontrado");

    let AND: any = [];
    if (email) {
      AND.push({ userId: user!.id });
    }

    const currentMonth = (new Date(currentDate).getMonth() + 1).toString();
    const currentYear = new Date(currentDate).getFullYear().toString();

    const startDate = composeDate("01", currentMonth, currentYear);
    const lastDay = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      0
    )
      .getDate()
      .toString();

    const endDate = composeDate(lastDay, currentMonth, currentYear);

    AND.push({ taskDate: { gte: new Date(startDate) } });
    AND.push({ taskDate: { lte: new Date(endDate) } });

    const recordsMonth = await prismaInstance.tasks.findMany({
      where: {
        AND,
      },
    });

    const arrayHelper: any[] = [];

    for (const key in recordsMonth) {
      arrayHelper.push({
        id: recordsMonth[key].id,
        name: recordsMonth[key].name,
        status: recordsMonth[key].status,
        time:
          timeKeeper(recordsMonth[key].endTime) -
          timeKeeper(recordsMonth[key].startTime),
        ...convertTime(
          timeKeeper(recordsMonth[key].endTime) -
            timeKeeper(recordsMonth[key].startTime)
        ),
      });
    }

    let hours = 0;
    arrayHelper.map((task) => (hours += task.time));

    hours = hours / 60;

    return response.status(200).json({ hours, user });
  } catch (error) {
    console.log(error);
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getHoursForChart = async (request: Request, response: Response) => {
  let months = [
    { month: "Jan", hours: 0, pv: 1 },
    { month: "Fev", hours: 0, pv: 1 },
    { month: "Mar", hours: 0, pv: 1 },
    { month: "Abr", hours: 0, pv: 1 },
    { month: "Mai", hours: 0, pv: 1 },
    { month: "Jun", hours: 0, pv: 1 },
    { month: "Jul", hours: 0, pv: 1 },
    { month: "Ago", hours: 0, pv: 1 },
    { month: "Set", hours: 0, pv: 1 },
    { month: "Out", hours: 0, pv: 1 },
    { month: "Nov", hours: 0, pv: 1 },
    { month: "Dez", hours: 0, pv: 1 },
  ];
  try {
    const { email } = request.params;
    const { tags } = request.query;

    const user = await prismaInstance.user.findFirstOrThrow({
      where: { email },
    });

    let AND: any[] = [
      { userId: user!.id },
      { taskDate: { gte: new Date(new Date().getFullYear(), 0, 1) } },
      {
        taskDate: { lte: new Date(new Date().getFullYear() + 1, 0, 0) },
      },
    ];

    if (tags) {
      AND.push({ tags });
    }

    const groupTasks = await prismaInstance.tasks.findMany({
      where: { AND },
    });

    groupTasks.forEach((item) => {
      const monthIndex = item.taskDate.getMonth();
      months[monthIndex].hours +=
        (timeKeeper(item.endTime) - timeKeeper(item.startTime)) / 60;
      if (item.endTime) {
        months[monthIndex].pv = 0;
      }
    });

    return response.status(200).json(months);
  } catch (error) {
    console.log(error);
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

export default {
  getHoursForChart,
  getSingleTask,
  getTaskByUserEmail,
  createTask,
  removeTask,
  updateTask,
  getGroupTaskByTag,
  getRecordOfDay,
  getHoursLastDay,
  getHoursOfThreeLastDays,
  getHoursOfMonth,
};
