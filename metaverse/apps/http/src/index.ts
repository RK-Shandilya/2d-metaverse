import express from 'express'
import router from './routes/v1';


const app = express();
app.use(express.json());
app.use('/api/v1',router);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`listening at port ${3000}`)
})