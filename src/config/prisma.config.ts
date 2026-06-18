import { PrismaClient } from "../generated/prisma/index.js";
// import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env.config.js";
import { DBConnection } from "#types/prisma.type.js";

export const createPrismaClient = () => {
  console.log("Creating Prisma Client");

  // const pool = new Pool({
  //   connectionString: env.db_url,
  // });

  const adapter = new PrismaPg({ connectionString: env.db_url });

  return new PrismaClient({
    adapter,
  });
};

export const initDB = async (prisma: DBConnection) => {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.info("🚀 Auth_DB: prisma connected successfully");
  } catch (error) {
    console.error("☠️ Auth_DB: prisma connection failed", error);
    process.exit(1);
  }
};
