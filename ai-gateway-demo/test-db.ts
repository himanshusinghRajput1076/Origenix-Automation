import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const prisma = new PrismaClient();

async function main() {
  console.log("Connecting to database using:", process.env.DATABASE_URL);
  try {
    const count = await prisma.user.count();
    console.log("Success! User count:", count);
  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
