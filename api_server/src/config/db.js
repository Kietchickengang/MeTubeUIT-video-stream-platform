import "dotenv/config";
import { MongoClient, ServerApiVersion } from 'mongodb';

const DB_user = process.env.MONGODB_USER;
const DB_pass = process.env.MONGODB_PASSWORD;

const URI = `mongodb+srv://${DB_user}:${DB_pass}@team13db.kgq1bji.mongodb.net/?appName=Team13DB`

const client = new MongoClient(URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export {client};