import { Request, Response } from "express";
import { prismaInstance } from "../../database/prismaClient";

const create = async (request: Request, response: Response) => {
  const {
    email,
    title,
    content,
    categories,
    isPublic,
  }: {
    email: string;
    title: string;
    content: string;
    categories: boolean[];
    isPublic: boolean;
  } = request.body;
  try {
    const userByEmail = await prismaInstance.user.findFirst({
      where: { email },
    });

    if (!userByEmail) throw new Error("Usuário não encontrado");

    const note = await prismaInstance.note.create({
      data: {
        userId: userByEmail.id,
        title,
        content,
        categories: JSON.stringify(categories),
        isPublic,
      },
    });
    console.log({ note });

    return response
      .status(200)
      .json({ note, message: "Nota criada com sucesso." });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getNotesByUser = async (request: Request, response: Response) => {
  try {
    const { email } = request.params;
    const userByEmail = await prismaInstance.user.findFirst({
      where: { email },
    });

    if (!userByEmail) throw new Error("Usuário não encontrado");

    const notes = await prismaInstance.note.findMany({
      where: { userId: userByEmail.id },
    });

    const notesFormated = notes.map((note) => {
      return {
        ...note,
        categories: JSON.parse(note.categories!),
      };
    });

    return response.status(200).json({ user: userByEmail, notesFormated });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const update = async (request: Request, response: Response) => {
  const { id } = request.params;
  const {
    title,
    content,
    categories,
    isPublic,
  }: {
    title: string;
    content: string;
    categories: boolean[];
    isPublic: boolean;
  } = request.body;
  try {
    const note = await prismaInstance.note.update({
      where: { id },
      data: {
        title,
        content,
        categories: JSON.stringify(categories),
        isPublic,
      },
    });
    console.log({ note });

    return response
      .status(200)
      .json({ note, message: "Nota alterada com sucesso." });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const remove = async (request: Request, response: Response) => {
  const { id } = request.params;
  try {
    await prismaInstance.note.delete({
      where: { id },
    });

    return response.status(200).json({ message: "Nota deletada com sucesso." });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

export default { create, getNotesByUser, update, remove };
