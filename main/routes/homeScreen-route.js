import express from 'express';
import * as processController from '../controllers/process-controller.js';
const router = express.Router();


router.route('/:id')
    .post(processController.post);

export default router;