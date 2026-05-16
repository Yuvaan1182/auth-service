import { RedisServiceInterface } from "#interface/redis.service.interface.js";
import { PostgreDBInterface } from "#interface/postgre.db.interface.js";
import { Express } from "express";

export type ServerOptions = {
  redis?: RedisServiceInterface;
  port?: number;
  db?: PostgreDBInterface; // Updated to use the interface for dependency injection
  createApp?: Express; // Ensure createApp is a function
};
