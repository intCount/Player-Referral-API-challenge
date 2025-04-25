// src/app.ts
import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { connect } from './config/database';
import { errorMiddleware } from './middlewares/error.middleware';

import authRoutes from './routes/auth.routes';
import playerRoutes from './routes/player.routes';
import walletRoutes from './routes/wallet.routes';
import referralRoutes from './routes/referral.routes';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.connectToDatabase();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(morgan('dev'));
  }

  private initializeRoutes(): void {
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/players', playerRoutes);
    this.app.use('/api/wallet', walletRoutes);
    this.app.use('/api/referrals', referralRoutes);
  }

  private initializeErrorHandling(): void {
    this.app.use(errorMiddleware);
  }

  private async connectToDatabase(): Promise<void> {
    await connect();
  }

  public listen(): void {
    const PORT = process.env.PORT || 3000;
    this.app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}

export default App;

// src/server.ts
import 'dotenv/config';
import App from './app';

const app = new App();
app.listen();

// src/config/database.ts
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const connect = async (): Promise<void> => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/player-referral-api';
    await mongoose.connect(MONGODB_URI);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};