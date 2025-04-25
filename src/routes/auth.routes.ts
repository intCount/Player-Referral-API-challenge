// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { Validator } from '../utils/validator';
import { requestMiddleware } from '../middlewares/request.middleware';
import { CustomRequestHandler } from '../interfaces/express.interface';
import { asHandler } from '../utils/request-handler.util';

const router = Router();
const authController = new AuthController();

// Register a new player
router.post(
  '/register',
  asHandler(requestMiddleware),
  validationMiddleware(Validator.validatePlayerRegistration),
  authController.register
);

// Login existing player
router.post(
  '/login',
  validationMiddleware(Validator.validatePlayerLogin),
  authController.login
);

export default router;