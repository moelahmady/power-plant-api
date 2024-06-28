/**
 * Express router for handling plant routes, including a route for getting the top plants.
 * 
 * @module routes/plantRoutes
 * @function GET /top - Route for getting the top plants.
 * @param {Request} req - The Express request object for the GET /top route.
 * @param {Response} res - The Express response object for the GET /top route.
 * @returns {void}
 */

import express from 'express';
import * as plantController from '../controllers/plantController';

const router = express.Router();

router.get('/top', plantController.getTopPlantsHandler);

export default router;