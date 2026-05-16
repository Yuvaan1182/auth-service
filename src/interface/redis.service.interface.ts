export interface RedisServiceInterface {
  connect(): Promise<void>;
  setKeyWithTTL(key: string, val: string, ttl: number): Promise<boolean>;
  getValWithKey(key: string): Promise<string | null>;
  delKey(key: string): Promise<boolean>;
}
