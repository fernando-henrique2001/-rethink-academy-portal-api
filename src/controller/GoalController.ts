import { Request, Response } from "express";
import { prismaInstance } from "../../database/prismaClient";

const create = async (request: Request, response: Response) => {
  const { title, conclude }: { title: string; conclude: boolean } =
    request.body;
  const { goalListId } = request.params;
  try {
    const goalListById = await prismaInstance.goalList.findFirst({
      where: { id: goalListId },
    });

    if (!goalListById) throw new Error("Meta não encontrada");

    const goal = await prismaInstance.goal.create({
      data: {
        title,
        conclude,
        goalListId: goalListById.id,
      },
    });

    return response
      .status(200)
      .json({ goal, message: "Meta criada com sucesso." });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const update = async (request: Request, response: Response) => {
  const { title, conclude }: { title?: string; conclude?: boolean } =
    request.body;
  const { id } = request.params;
  console.log({ title, conclude, id });
  try {
    const goal = await prismaInstance.goal.update({
      where: { id: id },
      data: {
        title,
        conclude,
      },
    });

    return response
      .status(200)
      .json({ goal, message: "Meta editada com sucesso." });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const remove = async (request: Request, response: Response) => {
  const { id } = request.params;
  try {
    await prismaInstance.goal.delete({
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

export default { create, update, remove };
