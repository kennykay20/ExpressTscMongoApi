import { config } from "../config";
import { createClient } from "redis";
import { createHash } from "crypto";
import { injectable } from "tsyringe";

@injectable()
export class CacheService {
  private client: any;
  constructor() {
    this.client = createClient({
      password: config.redis.PASSWORD,
      socket: {
        host: config.redis.HOST,
        port: config.redis.PORT
      }
    });
  }

  getHash = (value: any = ""): string => {
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }
    value = value.toString();
    return createHash("md5").update(value).digest("hex");
  };

  save = async (
    key: string,
    data: string,
    duration?: number
  ): Promise<any> => {
    try {
      await this.client.connect();
      if (duration) {
        return this.client.set(key, data, "EX", duration);
      } else {
        return this.client.set(key, data);
      }
    } catch (error) {
      this.client.on('error', (error: Error) => console.log('<:: Redis Client Error', error));
    }
  };

  get = async (key: string): Promise<any> => {
    try {
      await this.client.connect();
      return this.client.get(key);
    } catch (error) {
      this.client.on('error', (error: Error) => console.log('<:: Redis Client Error', error));
    }
  };

  del = async (key: string): Promise<unknown> => {
    return this.client.del(key);
  };

  saveUserExist = async (key: string, data: any) => {
    const hash = this.getHash(key);
    const newKey = `api::userexist::${hash}`;
    await this.save(newKey, JSON.stringify(data), 3600);
  };

  getUserExist = async (key: string) => {
    const hash = this.getHash(key);
    const newKey = `api::userexist::${hash}`;
    const result = await this.get(newKey);
    if (result) {
      return JSON.parse(result);
    } else {
      return undefined;
    }
  };
}
