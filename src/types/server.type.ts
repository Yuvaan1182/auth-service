import { RedisServiceInterface } from "#interface/redis.service.interface.js";
import { Express } from "express";

export type ServerOptions = {
  port?: number;
  createApp?: Express; // Ensure createApp is a function
};
