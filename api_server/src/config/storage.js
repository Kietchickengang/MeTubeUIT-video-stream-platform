import "dotenv/config";
import { S3Client } from "@aws-sdk/client-s3";

const vietnix = new S3Client({
    region: "REGION",

    endpoint: process.env.ENDPOINT,

    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_KEY,
    },

    forcePathStyle: true,
})

export default vietnix;