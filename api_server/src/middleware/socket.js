import { Server } from "socket.io";
import http from "http";
import express from 'express';

import { formatOut } from "../../../worker_server/src/util/helper.js";

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("----------------------------------------------");
    console.log(`${socket.id} connected`);

    socket.on("join_video_room", (videoId) => {
        socket.join(videoId);
        console.log(`[+] User joined room: ${formatOut(videoId)}`);
    })

    // allow UI to register user-specific room for notifications
    socket.on('join_user', (userId) => {
        if (!userId) return;
        const room = `user_${userId}`;
        socket.join(room);
        console.log(`[+] Socket ${socket.id} joined user room: ${room}`);
    });

    socket.on("disconnect", () => {
        console.log("[-] User disconnected or network fault");
        console.log("[-] Disconnecting socket...");
        console.log("[!]---- END ----");
        console.log("----------------------------------------------");
    })
})

export { io, httpServer, app };
