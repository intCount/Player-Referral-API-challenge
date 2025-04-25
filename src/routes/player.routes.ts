// src/routes/player.routes.ts
import { Router } from 'express';
import { PlayerController } from '../controllers/player.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const playerController = new PlayerController();

// Get player profile
router.get(
  '/profile',
  authMiddleware,
  playerController.getProfile
);

export default router;