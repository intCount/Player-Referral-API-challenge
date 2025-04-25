// src/routes/player.routes.ts
import { Router } from 'express';
import { PlayerController } from '../controllers/player.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { CustomRequestHandler } from '../interfaces/express.interface';
import { asHandler } from '../utils/request-handler.util';

const router = Router();
const playerController = new PlayerController();

// Get player profile
router.get(
  '/profile',
  asHandler(requestMiddleware),
  playerController.getProfile
);

export default router;