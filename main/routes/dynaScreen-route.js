import express from 'express';
import * as dynaScreenController from '../controllers/dynaScreen-controller.js';

const router = express.Router();

router.route('/:id')
    .get(dynaScreenController.find);

router.route('/:id/:stepId/:response')
    .put(dynaScreenController.put);

export default router;