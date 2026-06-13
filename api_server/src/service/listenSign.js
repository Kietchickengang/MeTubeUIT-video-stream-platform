import Redis from 'ioredis';
import "dotenv/config";

import { io } from '../middleware/socket.js';
import { formatOut } from '../../../worker_server/src/util/helper.js';
import { client } from '../config/db.js';
import { NotificationModel } from '../model/notificationModel.js';

const redisPort = process.env.REDIS_PORT;
const redisHost = process.env.REDIS_HOST;
const redisPass = process.env.REDIS_PASSWORD;

const redisSub = new Redis({
    port: redisPort,
    host: redisHost,
    password: redisPass,
    maxRetriesPerRequest: null,
});;

redisSub.subscribe('video_ready', (err, count) => {
    if (err) console.error("Redis Subscribe Error:", err);
    console.log(`Server is listening ${count} channel from Redis.`);
});


redisSub.on('message', (channel, message) => {
    if (channel === 'video_ready') {
        const { videoId, status } = JSON.parse(message);
                io.to(videoId).emit('video_ready_UI', { status });

                // Also notify subscribers of the uploader about new video
                (async () => {
                    try {
                        const db = client.db('Metube');
                        const videosColl = db.collection('videoCollection');
                        const usersColl = db.collection('userCollections');

                        const video = await videosColl.findOne({ videoId });
                        if (!video) return console.warn('Video not found for notification', videoId);

                        const uploaderId = (video.userId || '').toString();
                        if (!uploaderId) return;

                        // Find subscribers who have subscribed to uploaderId
                        const subs = await usersColl.find({ subscriptions: { $in: [uploaderId] } }).toArray();
                        if (!subs || subs.length === 0) return;

                        const notification = {
                            userId: null, // to be filled per recipient
                            type: 'new_video',
                            from: uploaderId,
                            videoId,
                            title: video.title || '',
                            read: false,
                            createdAt: new Date(),
                        };

                        for (const s of subs) {
                            const n = { ...notification, userId: s._id };
                            await NotificationModel.create(n);
                            // emit to user room
                            io.to(`user_${s._id.toString()}`).emit('notification', n);
                        }
                    } catch (e) {
                        console.error('Failed to notify subscribers:', e);
                    }
                })();

                console.log(`[+] Server informed UI via Socket - Video ${formatOut(videoId)} is READY`);
    }
});