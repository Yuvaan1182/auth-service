import { Request } from "./request.interface";
import { Response } from "./response.interface";

export interface Observation {
  request: Request;
  response: Response;
  duration: number;
  timestamp: string;
}
