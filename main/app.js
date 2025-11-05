import cors from 'cors';
import express from 'express';
import registerRouter from './routes/index.js';
import mongoose from 'mongoose';
import models from './models/index.js';

dotenv.config();

const initialize = (app) => {
    app.use(cors());
    app.use(express.json())
    app.use(express.urlencoded());

    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
        console.error('❌ MongoDB connection string not found. Please set MONGO_URI in .env file.');
        process.exit(1);
    }
    mongoose.connect(mongoURI)
        .then(() => console.log('✅ Connected to MongoDB successfully'))
        .catch(err => console.error('❌ MongoDB connection error:', err));;
    registerRouter(app);
}

export default initialize;
