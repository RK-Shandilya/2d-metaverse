import express from 'express'
import { dbConnect } from './config/dbConnect';

dbConnect();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

const port = process.env.PORT || 3000;

app.listen(port , ()=> {
    console.log(`Server is running on port ${port}`);
})