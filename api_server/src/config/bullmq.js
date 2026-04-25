import { Queue, Worker } from "bullmq";
import { redis_config } from "./redis.js";

const myJobOptions = {
    removeOnComplete: true,
    removeOnFail: {
        count: 777,
        age: 3600 * 24,
    }
}

export const videoQueue = new Queue("video_processing", {
    connection: redis_config,
    defaultJobOptions: myJobOptions,
})

export const initVideoQueue = async() => {
    await videoQueue.setGlobalConcurrency(2);
    await videoQueue.setGlobalRateLimit(5, 1000);
}

export const videoWorker = (job) => {
    return new Worker("video_processing", job, {
        connection: redis_config,
        concurrency: 2,
        removeOnComplete: true,
    })
}
