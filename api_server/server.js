import express from 'express';
import multer from 'multer';
import "dotenv/config";

import vietnix from './src/config/storage.js'
import { uploadRawVid } from './src/service/upload.js';

//import { connectDB } from '../worker_server/src/config/db.js'
//import { testDB } from '../worker_server/src/service/db.js';
//import { testMQ } from './src/service/queue.js';

const app = express();
const port = process.env.PORT;

//await connectDB();
//await testDB();
//const testRedisConnection = await redis_config.ping();
//console.log(testRedisConnection); 
//await testMQ();

// Use multer to upload file to object storage s3 (vietnix)
const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => {
    res.send("Hello world from k13t!");
    try{}
    catch(err){
        console.log(`Err: ${err.message}`);
    }
})

app.post("/test", upload.single("file"), async (req, res) => {
    try{
        const res_data = await uploadRawVid(req.file);
        return res.status(201).json({
            message: "Upload successfully",
            data: res_data,
         });
    }
    catch(err){
        console.log(`Upload failed: ${err.message}`);
        return res.status(500).json({
            message: "Upload failed.Try again",
            error: err.message,
        });
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})