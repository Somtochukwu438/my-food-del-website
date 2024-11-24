import express from 'express';
const promoRouter = express.Router();
import { validatePromoCode } from '../controllers/promoController.js';
promoRouter.post('/validate', validatePromoCode);

export default promoRouter;