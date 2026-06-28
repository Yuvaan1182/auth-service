import { Endpoint } from "./endpoint.interface";

export interface EndpointRepository {
  findByRoute(route: string): Promise<Endpoint | null>;
  save(endpoint: Endpoint): Promise<void>;
  findAll(): Promise<Endpoint[]>;
  clear(): Promise<void>;
}
