import { DBConnection } from "#types/prisma.type.js";
import { createPrismaClient, initDB } from "#config/prisma.config.js";

export class PostgreDB {
  // adding for debugging
  private static nextId = 1;
  public readonly id = PostgreDB.nextId++;
  private client?: DBConnection;
  private connected = false;

  constructor() {
    // don't create the Prisma client at construction time to avoid
    // performing work during module import. Create it lazily in connect().
    console.log(`PostgreDB:${this.id} constructed (client not created)`);
  }

  public async connect() {
    if (this.connected) return;

    if (!this.client) {
      this.client = createPrismaClient();
    }

    console.log(`PostgreDB:${this.id} connecting Prisma client...`);
    await initDB(this.client);

    this.connected = true;
    console.log(`PostgreDB:${this.id} connected`);
  }

  public getClient() {
    if (!this.client) {
      throw new Error(
        "PostgreDB client not initialized. Call connect() first.",
      );
    }

    return this.client;
  }
}
