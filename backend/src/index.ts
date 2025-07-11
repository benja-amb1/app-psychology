import express from 'express'
import cors from 'cors'
import cookiesParser from 'cookie-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import UserRoutes from './routes/users';
import PostsRoutes from './routes/posts';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 1234

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookiesParser());

app.use('/uploads', express.static('uploads')); //acceder a uploads

app.use('/users', UserRoutes);
app.use('/posts', PostsRoutes);

const connection = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI as string);
    console.log('✅ connected to mongoDB');
  } catch (error) {
    console.log(error);
  }
}

app.listen(PORT, () => {
  try {
    console.log(`🚀 server listening in port ${PORT}`);
    connection();
  } catch (error) {
    console.log(error);
  }
})