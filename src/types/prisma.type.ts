import { Prisma } from "../generated/prisma/index.js";
import { createPrismaClient } from "#config/prisma.config.js";

export type DBConnection = ReturnType<typeof createPrismaClient>;

export type DBClient = DBConnection | Prisma.TransactionClient;
