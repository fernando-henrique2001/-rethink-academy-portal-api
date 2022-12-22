import { Request, Response } from "express";
import { prismaInstance } from "../../database/prismaClient";

type TrailType = {
  name: string;
  description: string;
  weight: number;
  imageUrl: string;
};

const create = async (request: Request, response: Response) => {
  const { name, description, weight, imageUrl }: TrailType = request.body;
  try {
    const trail = await prismaInstance.trail.create({
      data: {
        name,
        weight,
        description,
        imageUrl,
      },
    });
    return response
      .status(201)
      .json({ trail, message: "Trilha criada com sucesso" });
  } catch (error) {
    response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getAll = async (request: Request, response: Response) => {
  try {
    const trail = await prismaInstance.trail.findMany({
      orderBy: {
        weight: "asc",
      },
    });

    return response.status(200).json({ trail });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const update = async (request: Request, response: Response) => {
  const { name, description, weight, imageUrl } = request.body;
  const { id } = request.params;
  try {
    const trail = await prismaInstance.trail.update({
      where: { id },
      data: {
        name,
        description,
        imageUrl,
        weight,
      },
    });

    return response
      .status(200)
      .json({ trail, message: "Trilha atualizada com sucesso" });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const deleteById = async (request: Request, response: Response) => {
  const { id } = request.params;
  try {
    const trail = await prismaInstance.trail.delete({
      where: { id },
    });

    return response
      .status(200)
      .json({ trail, message: "Trilha deletada com sucesso" });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};
export default { create, getAll, update, deleteById };
