import { DBConnection } from "#types/prisma.type.js";
import { createPrismaClient, initDB } from "#config/prisma.config.js";
import { PostgreDBInterface } from "#interface/postgre.db.interface.js";

export class PostgreDB implements PostgreDBInterface {
  private client: DBConnection;

  constructor() {
    this.client = this.createClient();
  }

  public createClient() {
    return createPrismaClient();
  }

  public async connect() {
    await initDB(this.client);
  }

  public async getClient() {
    /** -------- if client do not exist create client -------- */
    if (!this.client) {
      this.client = this.createClient();
    }
    return this.client;
  }
}
