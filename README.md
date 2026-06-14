# MeTube — Video Streaming Platform

MeTube is a small-scale video streaming web application inspired by common streaming platforms. It demonstrates an end-to-end flow for uploading, processing, storing and delivering video content with real-time notifications and a simple subscription model.

This repository contains three main components:

- `api_server` — Express-based API, MongoDB persistence, Socket.IO for realtime events, and Redis subscription to worker events.
- `worker_server` — Background processing (FFmpeg), job queues (BullMQ/Redis), and publishing `video_ready` events once processing finishes.
- `frontend/Metube-UI` — React + Vite single-page application that provides upload, playback, subscription and notification UI.

Table of contents
- Architecture and flow
- Prerequisites
- Setup & running (development)
- Environment variables
- Key APIs & behavior
- Data model notes
- Troubleshooting & common fixes
- Contribution

## Architecture and flow

1. A user uploads a raw video through the frontend. The file is stored to the raw S3 bucket and a job is enqueued.
2. The `worker_server` processes the video (transcoding, renditions, thumbnail), uploads outputs to the processed S3 bucket and updates the `videoCollection` document with `thumbnailUrl` and related metadata.
3. When processing completes the worker publishes a `video_ready` message to Redis containing `{ videoId, status }`.
4. The `api_server` subscribes to the Redis channel. On `video_ready` it:
	- finds the video and the uploader,
	- creates Notification documents for subscribers (and a single confirmation notification for the uploader),
	- emits socket `notification` events to user rooms (Socket.IO).
5. Frontend clients receive socket notifications (if connected) and render them in the notifications dropdown.

## Prerequisites

- Node.js (16+ recommended)
- MongoDB (Atlas or local)
- Redis server (for BullMQ and pub/sub)
- An S3-compatible storage (Vietnix endpoint in this project) with these buckets: `raw-video`, `processed-video`, `asset`.

## Setup & running (development)

1. Install dependencies for each component:

```bash
npm install --prefix api_server
npm install --prefix worker_server
npm install --prefix frontend/Metube-UI
```

2. Copy and fill environment files for `api_server` and `worker_server` (see `.env.example` or relevant `.env` keys below).

3. Start services (recommended to run each in its own terminal):

```bash
# start API server
npm --prefix api_server run start

# start worker
npm --prefix worker_server run start

# start frontend
npm --prefix frontend/Metube-UI run dev
```

## Environment variables

The project uses environment variables for DB, Redis and S3 configuration. Example keys used in this repo's `.env` files:

- `PORT` — API server port (default 8000)
- `MONGODB_URI` — MongoDB connection string
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` — Redis connection
- `ENDPOINT` — S3 endpoint (no trailing slash)
- `BUCKET_RAW_VIDEO`, `BUCKET_PROCESSED_VIDEO`, `BUCKET_ASSET` — bucket names
- `ACCESS_KEY_ID`, `SECRET_KEY` — S3 credentials
- `JWT_SECRET` — API JWT secret for authentication

Do not commit credentials to source control. Use environment-specific secret managers for production.

## Key APIs & behavior

- Authentication: endpoints for register/login and user profile. The public user endpoint returns `{ user: { id, name, avatarUrl } }`.
- Subscribe/unsubscribe: `POST /metube/auth/subscribe/:channelId` and `POST /metube/auth/unsubscribe/:channelId`.
- Notifications: `GET /metube/auth/notifications` and `POST /metube/auth/notifications/:id/read`.

Notification semantics:
- Subscribers receive a `new_video` notification when a channel they subscribed to publishes a video.
- The uploader receives a single `upload_success` notification when processing completes. The API will avoid sending the `new_video` message to the uploader to prevent duplicates.

Socket behavior:
- Clients should connect to the API server's Socket.IO endpoint and emit `join_user` with their user id to receive personal notifications. The server emits to rooms named `user_<userId>`.

## Data model notes

- `videoCollection` documents include `videoId`, `thumbnailUrl`, `userId` (uploader id), and `title`.
- `notifications` collection stores notifications with fields like `userId`, `from`, `fromName`, `fromAvatar`, `videoId`, `videoThumbnail`, `title`, `type`, `read`, `createdAt`.

## Troubleshooting & common fixes

- Dropdown clipped by parent: ensure the frontend renders the notification dropdown using a portal (`createPortal`) or set parent `overflow` to `visible` and use a high `z-index`.
- Missing avatars in UI: the backend normalizes stored avatar keys to a full URL, and the frontend will fetch public user info to fill missing avatar fields.
- Socket issues: confirm Redis and API server are up, and that the client successfully calls `socket.emit('join_user', userId)` after connecting.

## Scripts

- `api_server/scripts/backfillNotifications.js` — populate existing notifications with `videoThumbnail` from the `videoCollection` when needed.

## Contribution

Contributions are welcome. Please open issues describing bugs or feature requests, and submit pull requests with focused changes. Ensure that secrets are not included in PRs.

---

For full technical details and troubleshooting steps, see the code comments and the individual README files inside each subfolder.
