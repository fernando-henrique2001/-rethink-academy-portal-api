import { Request, Response } from "express";
import { prismaInstance } from "../../database/prismaClient";

const getAll = async (request: Request, response: Response) => {
  try {
    const goalList = await prismaInstance.goalList.findMany({
      include: {
        user: true,
        goal: true,
      },
    });
    return response.status(200).json({ goalList });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getByUserEmail = async (request: Request, response: Response) => {
  try {
    const { email } = request.params;

    const user = await prismaInstance.user.findFirstOrThrow({
      where: { email },
    });

    const goalList = await prismaInstance.goalList.findMany({
      where: { userId: user!.id },
      include: {
        user: true,
        goal: true,
      },
    });
    return response.status(200).json(goalList);
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const create = async (request: Request, response: Response) => {
  const { name }: { name: string } = request.body;
  const { email } = request.params;
  try {
    const userByEmail = await prismaInstance.user.findFirst({
      where: { email: email },
    });

    if (!userByEmail) throw new Error("Usuário não encontrado");

    const goalList = await prismaInstance.goalList.create({
      data: {
        name,
        userId: userByEmail.id,
      },
    });

    return response
      .status(200)
      .json({ goalList, message: "Meta criada com sucesso." });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const update = async (request: Request, response: Response) => {
  const { name }: { name: string } = request.body;
  const { id } = request.params;
  try {
    const goalList = await prismaInstance.goalList.update({
      where: { id: id },
      data: {
        name,
      },
    });

    return response
      .status(200)
      .json({ goalList, message: "Meta editada com sucesso." });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const remove = async (request: Request, response: Response) => {
  const { id } = request.params;
  try {
    await prismaInstance.goalList.delete({
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

export default { create, update, getAll, getByUserEmail, remove };
