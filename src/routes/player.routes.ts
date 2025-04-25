// src/routes/player.routes.ts
import { Router } from 'express';
import { PlayerController } from '../controllers/player.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requestMiddleware } from '../middlewares/request.middleware';
import { asHandler, asRequestWithPlayerHandler } from '../utils/request-handler.util';

const router = Router();
const playerController = new PlayerController();

// Get player profile
router.get(
  '/profile',
  asHandler(authMiddleware),
  asHandler(requestMiddleware),
  asRequestWithPlayerHandler(playerController.getProfile)
);

export default router;