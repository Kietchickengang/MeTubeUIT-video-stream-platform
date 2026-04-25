import { Queue } from 'bullmq';
import Redis from 'ioredis';
import "dotenv/config";

const redis_port = process.env.REDIS_PORT;
const redis_host = process.env.REDIS_HOST;
const redis_password = process.env.REDIS_PASSWORD;

export const redis_config = new Redis({
    port: redis_port,
    host: redis_host,
    password: redis_password,
    maxRetriesPerRequest: null,
})

redis_config.on("connect", () => {
  console.log("Redis connected successfully");
});

redis_config.on("error", (err) => {
  console.error("Something wrong with Redis:", err.message);
});