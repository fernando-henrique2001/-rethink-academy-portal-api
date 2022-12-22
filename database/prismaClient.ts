import { PrismaClient, Main, Roles } from "@prisma/client";
const prismaInstance = new PrismaClient();

export { prismaInstance, Main, Roles};
