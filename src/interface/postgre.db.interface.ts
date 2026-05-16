import { DBConnection } from "#types/prisma.type.js";

export interface PostgreDBInterface {
  createClient(): DBConnection; // Method to create a database client
  connect(): Promise<void>; // Method to connect to the database
  getClient(): Promise<DBConnection>; // Method to get the database client
}
