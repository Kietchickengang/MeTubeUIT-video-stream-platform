import { connectDB } from "../config/db.js";
import { ObjectId } from "mongodb";

const db = await connectDB();

const videos = db.collection("videoCollection");

const sampleTest = {
  videoId: "vid_001",
  userId: new ObjectId(),
  title: "Test video",
  description: "Demo insert",
  status: "uploading",
  videoPath: "video/raw/vid_001.mp4",
  hlsPath: "hls/vid_001/index.m3u8",
  thumbnailUrl: "thumbnail/vid_001.jpg",
  duration: 120,
  resolution: "720p",
  videoSize: 5000000,
  mimeType: "video/mp4",
  unexpected_err: "",
  retryCnt: 0,
  createdAt: new Date(),
  updatedAt: new Date()
}

export const testDB = async() => await videos.insertOne(sampleTest);