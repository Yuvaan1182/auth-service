import type { RequestHandler } from "express";

export interface RouteScribeOptions {
  output?: string;

  title?: string;

  version?: string;
}

export interface RouteScribe {
  middleware(): RequestHandler;
}
