import { Request, Response } from "express";
import { prismaInstance } from "../../database/prismaClient";

const create = async (request: Request, response: Response) => {
  const {
    email,
    college,
    semester,
    workTime,
    transportationVoucher,
    providedEquipment,
    status,
  }: {
    email: string;
    college: string;
    semester: string;
    workTime: string;
    transportationVoucher: string;
    providedEquipment: string;
    status: string;
  } = request.body;
  try {
    const userByEmail = await prismaInstance.user.findFirst({
      where: { email },
    });

    if (!userByEmail) throw new Error("Usuário não encontrado");

    const info = await prismaInstance.info.create({
      data: {
        userId: userByEmail.id,
        college,
        semester,
        workTime,
        transportationVoucher,
        providedEquipment,
        status,
      },
    });
    return response
      .status(200)
      .json({ info, message: "Informações inseridas com sucesso" });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const getInfoByUser = async (request: Request, response: Response) => {
  try {
    const { email } = request.params;
    const userByEmail = await prismaInstance.user.findFirst({
      where: { email },
    });

    if (!userByEmail) throw new Error("Usuário não encontrado");

    const info = await prismaInstance.info.findFirst({
      where: { userId: userByEmail.id },
    });

    console.log(info);

    return response.status(200).json({ user: userByEmail, info });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

const updateInfo = async (request: Request, response: Response) => {
  const { email } = request.params;
  const userByEmail = await prismaInstance.user.findFirst({
    where: { email },
  });

  if (!userByEmail) throw new Error("Usuário não encontrado");
  const {
    college,
    semester,
    workTime,
    transportationVoucher,
    providedEquipment,
    status,
  }: {
    college: string;
    semester: string;
    workTime: string;
    transportationVoucher: string;
    providedEquipment: string;
    status: string;
  } = request.body;
  try {
    const info = await prismaInstance.info.update({
      where: { userId: userByEmail.id },
      data: {
        college,
        semester,
        workTime,
        transportationVoucher,
        providedEquipment,
        status,
      },
    });
    console.log({ info });

    return response
      .status(200)
      .json({ info, message: "Informações atualizadas com sucesso!" });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Algo de errado aconteceu.", error: error.message });
  }
};

export default { create, getInfoByUser, updateInfo };
