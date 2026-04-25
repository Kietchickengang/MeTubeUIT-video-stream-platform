import { PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import "dotenv/config";

import vietnix from "../config/storage.js";
import { vnTimeString, checkValidFormat } from "../util/helper.js";

const raw_video_bucket = process.env.BUCKET_RAW_VIDEO;

export const uploadRawVid = async(file) => {
    const filename = file.originalname;
    if(!checkValidFormat(filename)) throw new Error("Unsupport this file's extension");

    const key = `videos/${vnTimeString}_${filename}`;
    const my_command = new PutObjectCommand({
        ACL: "private",
        Bucket: raw_video_bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    });

    await vietnix.send(my_command);
    return {
        status: "Created",
        info: {
            vietnix_upload_path: key,
            file_name: filename,
            mime_type: file.mimetype,
            size: file.size,
            upload_time: vnTimeString,
        }
    }
}