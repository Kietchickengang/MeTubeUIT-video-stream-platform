import express from 'express';
import { worker } from './src/service/ffmpeg.js';
import { redis_config } from '../api_server/src/config/redis.js';
import "dotenv/config"

const app = express();
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})