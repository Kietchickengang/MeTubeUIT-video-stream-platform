import express from 'express';
import vietnix from './src/config/storage.js'
import multer from 'multer';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import "dotenv/config";

const app = express();
const port = process.env.PORT;

// Use multer to upload file to object storage s3 (vietnix)
const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => {
    res.send("Hello world!");
    try{}
    catch(err){
        console.log(`Err: ${err}`);
    }
})

app.post("/test", upload.single("file"), async (req, res) => {
    try{
        const key = `audit/${Date.now()}-${req.file.originalname}`;
        await vietnix.send(
        new PutObjectCommand({
            ACL: 'private',
            Bucket: process.env.BUCKET_LOGS,
            Key: key,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        })
        )
    }
    catch(err){
        console.log(`Upload failed: ${err}`);
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})