import cors from 'cors';
import express from 'express';
import registerRouter from './routes/index.js';
import mongoose from 'mongoose';
import models from './models/index.js';

const initialize = (app) => {
    app.use(cors());
    app.use(express.json())
    app.use(express.urlencoded());
    mongoose.connect('mongodb+srv://Himanshipanchal:Himanshi123@cluster41328.gpnfbvh.mongodb.net/designerStudioDB?retryWrites=true&w=majority');
    registerRouter(app);
}

export default initialize;