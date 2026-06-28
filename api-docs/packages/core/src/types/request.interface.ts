export interface Request {
  headers: Record<string, unknown>;
  query: unknown;
  params: unknown;
  body: unknown;
}
