import { client } from '../../../api_server/src/config/db.js';

let isConnected = false;

export const connectDB = async() => {
    if(isConnected) return client.db("Metube");
    try {
        await client.connect();
        isConnected = true;
        console.log(`Connect DB successfully. Welcome!`);
        return client.db("Metube");
    }
    catch(err){
        console.log(`DB Err: ${err}`);
        throw err;
    } 
}
