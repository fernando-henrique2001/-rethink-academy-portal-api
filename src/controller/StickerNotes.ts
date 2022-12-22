import { Request, Response } from "express";
import { prismaInstance } from "../../database/prismaClient";

type StickerNotesProps = {
  description: string;
  data: string;
  priority: number;
  email: string;
};

const getStickerNotesByUserEmail = async (
  request: Request,
  response: Response
) => {
  try {
    const { email }: { email?: string } = request.params;
    console.log(email);

    const user = await prismaInstance.user.findFirst({
      where: { email },
    });

    if (!user) throw new Error("Usuário não encontrado");

    const stickerNotes = await prismaInstance.stickerNotes.findMany({
      orderBy: [
        {
          priority: "asc",
        },
        {
          description: "asc",
        },
      ],
      where: {
        userId: user.id,
      },
    });

    return response.status(200).json({ stickerNotes });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const createstickerNotes = async (request: Request, response: Response) => {
  try {
    const { description, email }: StickerNotesProps = request.body;

    if (!email) throw new Error("Email obrigatório");

    const user = await prismaInstance.user.findFirst({
      where: { email },
    });
    if (!user) throw new Error("Usuário não encontrado");

    const stickerNotes = await prismaInstance.stickerNotes.create({
      data: {
        description,
        data: new Date(),
        priority: 3,
        userId: user.id,
      },
    });

    return response.status(200).json({
      stickerNotes,
      message: `Lembrete criado com sucesso para o user: ${user.id}`,
    });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const removeStickerNotes = async (request: Request, response: Response) => {
  const { id } = request.params;
  try {
    await prismaInstance.stickerNotes.delete({
      where: { id },
    });

    return response
      .status(200)
      .json({ message: "Lembrete deletado com sucesso." });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const updateStickerNotes = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { description, priority }: StickerNotesProps = request.body;

  console.log(request.body);

  try {
    const stickerNotes = await prismaInstance.stickerNotes.update({
      where: { id },
      data: {
        description,
        priority,
      },
    });

    return response
      .status(200)
      .json({ stickerNotes, message: "Lembrete alterado com sucesso." });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getStickerNotesById = async (request: Request, response: Response) => {
  try {
    const { id }: { id?: string } = request.params;

    const stickerNotes = await prismaInstance.stickerNotes.findFirst({
      where: { id },
    });

    return response.status(200).json({ stickerNotes });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

export default {
  getStickerNotesByUserEmail,
  createstickerNotes,
  removeStickerNotes,
  updateStickerNotes,
  getStickerNotesById,
};
