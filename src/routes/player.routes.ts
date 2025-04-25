// src/routes/player.routes.ts
import { Router } from 'express';
import { PlayerController } from '../controllers/player.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { CustomRequestHandler } from '../interfaces/express.interface';

const router = Router();
const playerController = new PlayerController();

// Get player profile
router.get(
  '/profile',
  authMiddleware as CustomRequestHandler,
  playerController.getProfile
);

export default router;