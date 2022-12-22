import { Request, Response } from "express";
import { prismaInstance } from "../../database/prismaClient";

const create = async (request: Request, response: Response) => {
  const { name, courseId } = request.body;
  try {
    const module = await prismaInstance.module.create({
      data: {
        name,
        courseId,
      },
    });
    return response
      .status(201)
      .json({ module, message: "Módulo criado com sucesso" });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getAll = async (request: Request, response: Response) => {
  try {
    const modules = await prismaInstance.module.findMany({});

    return response.status(200).json({ modules });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getById = async (request: Request, response: Response) => {
  const { id } = request.params;
  try {
    const module = await prismaInstance.module.findUnique({
      where: {
        id,
      },
    });

    return response.status(200).json({ module });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const update = async (request: Request, response: Response) => {
  const { name, courseId } = request.body;
  const { id } = request.params;
  try {
    const module = await prismaInstance.module.update({
      where: { id },
      data: {
        name,
        courseId,
      },
    });
    return response
      .status(200)
      .json({ module, message: "Módulo atualizado com sucesso" });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const deleteById = async (request: Request, response: Response) => {
  const { id } = request.params;
  try {
    const module = await prismaInstance.module.delete({
      where: { id },
    });

    return response
      .status(200)
      .json({ module, message: "Módulo deletado com sucesso" });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};
export default { create, getAll, getById, update, deleteById };
