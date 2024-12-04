import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const URL : string | undefined =  process.env.MONGO_URL;
console.log(URL);

if(!URL){
    console.log('Please define the MONGO_URL environment variable');
    process.exit(1);
}

export const dbConnect = async ():Promise<void> => { 
    try {
        await mongoose.connect(URL);
        console.log("Connected to MongoDB");    
    }
    catch(error){
        console.log(`Error connecting to MongoDB: ${error}`);
        process.exit(1);
    }
}