import { Request, Response } from "express";
import { prismaInstance } from "../../database/prismaClient";

type badgeType =
  | "product"
  | "engineering"
  | "academy"
  | "design"
  | "welcome"
  | "studies"
  | "timeRecord"
  | "goals";

const getUserBadges = async (request: Request, response: Response) => {
  try {
    const { email } = request.params;
    const user = await prismaInstance.user.findFirstOrThrow({
      where: { email },
    });
    if (!user) throw new Error("user not Found");
    const data = await prismaInstance.badges.findUnique({
      where: { userId: user.id },
    });
    response.status(200).json(data);
  } catch (error) {
    return response.status(400).json(error.message);
  }
};

const giveBadge = async (request: Request, response: Response) => {
  try {
    const {
      badge,
      email,
      description,
    }: { badge: badgeType; email: string; description: string } = request.body;

    const user = await prismaInstance.user.findFirstOrThrow({
      where: { email },
    });
    if (!user) throw new Error("user not Found");

    const data = await prismaInstance.badges.findUnique({
      where: { userId: user.id },
    });

    if (data) {
      if (data[badge].includes(description)) {
        throw new Error("User already have this badge");
      }
      const badgeData = await prismaInstance.badges.update({
        where: { userId: user.id },
        data: {
          [badge]: [...data[badge], description],
        },
      });
      response.status(200).json(badgeData);
    } else {
      const badgeData = await prismaInstance.badges.create({
        data: {
          userId: user.id,
          [badge]: [description],
        },
      });

      response.status(200).json(badgeData);
    }
  } catch (error) {
    return response.status(400).json(error.message);
  }
};

export default { giveBadge, getUserBadges };
