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

  // Inside src/app.ts in the initializeRoutes() method

private initializeRoutes(): void {
this.app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Player Referral API is running',
    endpoints: {
      auth: '/api/auth',
      players: '/api/players',
      wallet: '/api/wallet',
      referrals: '/api/referrals'
    }
  });
});

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



