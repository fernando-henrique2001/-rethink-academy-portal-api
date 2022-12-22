import { Request, Response } from "express";
import { prismaInstance } from "../../database/prismaClient";

type CourseTimelineType = {
  stage: string;
  start: Date;
  finish: Date;
  content: string;
  trailId: string;
};

const create = async (request: Request, response: Response) => {
  const { stage, start, finish, content, trailId }: CourseTimelineType =
    request.body;
  try {
    const stageLine = await prismaInstance.courseTimeline.create({
      data: {
        stage,
        start: start.toLocaleDateString(),
        finish,
        content,
        trailId,
      },
    });
    return response
      .status(201)
      .json({ stageLine, message: "Etapa criada com sucesso" });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getByTrailId = async (request: Request, response: Response) => {
  const { trailId } = request.params;
  try {
    const stageLine = await prismaInstance.courseTimeline.findMany({
      where: {
        trailId,
      },
      orderBy: {
        start: "asc",
      },
    });

    return response.status(200).json(stageLine);
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const upsert = async (request: Request, response: Response) => {
  const { stage, start, finish, content, trailId } = request.body;
  const { id } = request.params;
  try {
    const stageLine = await prismaInstance.courseTimeline.upsert({
      where: { id },
      update: {
        stage,
        start,
        finish,
        content,
      },
      create: {
        stage,
        start,
        finish,
        content,
        trailId,
      },
    });

    return response
      .status(200)
      .json({ stageLine, message: "Etapa atualizada com sucesso" });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const deleteById = async (request: Request, response: Response) => {
  const { id } = request.params;
  try {
    const stageLine = await prismaInstance.courseTimeline.delete({
      where: { id },
    });

    return response
      .status(200)
      .json({ stageLine, message: "Etapa deletada com sucesso" });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};
export default { create, getByTrailId, upsert, deleteById };
