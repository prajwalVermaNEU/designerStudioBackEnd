import express from 'express';
import * as processController from '../controllers/process-controller.js';
const router = express.Router();


router.route('/:id')
    .get(processController.find)
    .put(processController.put)
    .delete(processController.remove)
    .post(processController.deploy)
    .post(processController.post);

export default router;