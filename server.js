import express from 'express';
import initialize from './main/app.js';

const app = express();
initialize(app);

const port = 3000;
app.listen( port , ()=>console.log('Server is listening to '+port));