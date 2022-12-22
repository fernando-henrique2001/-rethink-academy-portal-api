import { Request, Response } from "express";
import { prismaInstance } from "../../database/prismaClient";

const upsert = async (request: Request, response: Response) => {
  try {
    const { title, email, url }: { title: string; email: string; url: string } =
      request.body;
    if (!email) throw new Error("não tem user");

    const user = await prismaInstance.user.findFirstOrThrow({
      where: { email },
    });

    const data = await prismaInstance.bucket.create({
      data: {
        title,
        userId: user.id,
        url,
      },
    });
    response.status(200).json(data);
  } catch (error) {
    return response.status(400).json(error.message);
  }
};

const getOneBucket = async (request: Request, response: Response) => {
  try {
    const { email }: { email?: string } = request.query;
    const { title } = request.params;
    if (!email) throw new Error("não tem user");

    const user = await prismaInstance.user.findFirstOrThrow({
      where: { email },
    });

    const data = await prismaInstance.bucket.findFirstOrThrow({
      where: {
        userId: user.id,
        url: Buffer.from(title, "base64").toString(),
      },
    });
    response.status(200).json(data);
  } catch (error) {
    return response.status(400).json(error.message);
  }
};

const deleteFile = async (request: Request, response: Response) => {
  const { id } = request.params;
  try {
    await prismaInstance.bucket.delete({
      where: { id },
    });

    return response
      .status(200)
      .json({ message: "Arquivo deletado com sucesso." });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getUserBucket = async (request: Request, response: Response) => {
  try {
    const { email }: { email?: string } = request.query;
    if (!email) throw new Error("não tem user");

    const user = await prismaInstance.user.findFirstOrThrow({
      where: { email },
    });

    const data = await prismaInstance.bucket.findMany({
      where: { userId: user.id },
    });
    response.status(200).json(data);
  } catch (error) {
    return response.status(400).json(error.message);
  }
};

export default { upsert, getOneBucket, getUserBucket, deleteFile };
