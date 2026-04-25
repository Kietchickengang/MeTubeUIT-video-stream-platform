import { redis_config } from "../config/redis.js";
import { videoQueue, initVideoQueue } from "../config/bullmq.js";

initVideoQueue();

// Sample test
export const testMQ = async() => {
    await videoQueue.add("transcode", {
        videoId: "vid_test_001",
        videoPath: "video/raw/test.mp4",
    })
};