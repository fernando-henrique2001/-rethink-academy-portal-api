import { Request, Response } from "express";
import { prismaInstance } from "../../database/prismaClient";
import { skillLibrary, skillLibraryType } from "../helpers/skillLibrary";

const create = async (request: Request, response: Response) => {
  const {
    month,
    userEmail,
    skillType,
    skill1,
    skill2,
    skill3,
    skill4,
    skill5,
    skill6,
  }: {
    month: string;
    userEmail: string;
    skillType: boolean;
    skill1: number;
    skill2: number;
    skill3: number;
    skill4: number;
    skill5: number;
    skill6: number;
  } = request.body;
  try {
    console.log({ data: request.body });
    const userByEmail = await prismaInstance.user.findFirst({
      where: { email: userEmail },
    });

    if (!userByEmail) throw new Error("Usuário não encontrado");

    const monthEvaluate = await prismaInstance.monthEvaluate.create({
      data: {
        month,
        userId: userByEmail.id,
        email: userByEmail.email,
        skillType,
        skill1,
        skill2,
        skill3,
        skill4,
        skill5,
        skill6,
      },
    });

    return response
      .status(200)
      .json({ monthEvaluate, message: "Nota criada com sucesso." });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getEvaluates = async (request: Request, response: Response) => {
  try {
    const { month } = request.params;
    const { skillType }: { skillType?: string | boolean } = request.query;
    let skillTypeBoolean = true;

    if (skillType === "false") skillTypeBoolean = false;

    const users = await prismaInstance.user.findMany({
      where: { role: "STUDENT" },
    });

    const usersMap = users.map(async (user) => {
      const evaluate = await prismaInstance.monthEvaluate.findFirst({
        where: { userId: user.id, month, skillType: skillTypeBoolean },
      });
      if (!evaluate) {
        return {
          month,
          userId: user.id,
          email: user.email,
          skillType: skillTypeBoolean,
          skill1: 0,
          skill2: 0,
          skill3: 0,
          skill4: 0,
          skill5: 0,
          skill6: 0,
          main: user.main,
          name: `${user.name} ${user.surname}`,
        };
      }
      return {
        ...evaluate,
        main: user.main,
        name: `${user.name} ${user.surname}`,
      };
      // return { name: `teste`, ...evaluate };
    });

    return response.status(200).json(await Promise.all(usersMap));
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const update = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const {
      value,
      main,
      skill,
      skillType,
    }: {
      value: string;
      main: string;
      skill: string;
      skillType: boolean;
    } = request.body;

    console.log("UPDATE ENTROU");
    let helper = skillLibrary[main][skill];
    if (skillType === false) helper = skillLibrary.SOFT[skill];
    console.log({ value, main, skill, skillType, helper, id });

    const evaluateUpdated = await prismaInstance.monthEvaluate.update({
      where: { id },
      data: { [helper]: parseInt(value) },
    });

    return response
      .status(200)
      .json({ evaluateUpdated, message: "Avaliação alterada com sucesso." });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const remove = async (request: Request, response: Response) => {
  const { id } = request.params;
  try {
    await prismaInstance.monthEvaluate.delete({
      where: { id },
    });

    return response
      .status(200)
      .json({ message: "Avaliação deletada com sucesso." });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getEvaluateChartData = async (request: Request, response: Response) => {
  try {
    const {
      skill,
      header,
    }: {
      skill?: string;
      header?: "ENGINEERING" | "DESIGN" | "PRODUCT" | "SOFT";
    } = request.query;
    const { email } = request.params;
    const userByEmail = await prismaInstance.user.findFirst({
      where: { email },
    });

    if (!userByEmail) throw new Error("Usuário não encontrado");
    let skillType = header === "SOFT" ? false : true;
    const evaluation = await prismaInstance.monthEvaluate.findMany({
      where: { userId: userByEmail.id, skillType },
    });
    const chartData = evaluation.map((item) => ({
      name: item.month.replace(/\s/g, "/"),
      skill: item[skillLibrary[header!][skill!]],
      pv: item[skillLibrary[header!][skill!]] === 0 ? 1 : 0,
    }));

    console.log(skillLibrary[header!][skill!]);

    return response.status(200).json({ chartData, skill });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

export default { getEvaluates, create, update, remove, getEvaluateChartData };
