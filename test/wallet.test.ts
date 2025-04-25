// test/wallet.test.ts
import request from 'supertest';
import mongoose from 'mongoose';
import App from '../src/app';
import { Player } from '../src/models/player.model';
import { Wallet } from '../src/models/wallet.model';

const app = new App().app;
let token: string;
let playerId: string;

describe('Wallet Controller', () => {
  beforeAll(async () => {
    // Connect to test database
    const MONGODB_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/player-referral-api-test';
    await mongoose.connect(MONGODB_URI);

    // Create a test player
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Wallet Test Player',
        phoneNumber: '+1234567890',
        password: 'password123',
      })
      .set('Origin', 'https://example.com');

    token = registerResponse.body.data.token;
    playerId = registerResponse.body.data.player.id;
  });

  afterAll(async () => {
    // Clean up and close connection
    await Player.deleteMany({});
    await Wallet.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/wallet', () => {
    it('should get wallet balance', async () => {
      const response = await request(app)
        .get('/api/wallet')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('wallet');
      expect(response.body.data.wallet).toHaveProperty('balance');
      expect(response.body.data.wallet.playerId).toBe(playerId);
    });

    it('should return error without auth token', async () => {
      const response = await request(app).get('/api/wallet');

      expect(response.status).toBe(401);
      expect(response.body.success).toBeFalsy();
    });
  });

  describe('POST /api/wallet/deposit', () => {
    it('should deposit amount to wallet', async () => {
      const response = await request(app)
        .post('/api/wallet/deposit')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 1000,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('wallet');
      expect(response.body.data.wallet.balance).toBe(1000);
    });

    it('should return error for amount less than minimum', async () => {
      const response = await request(app)
        .post('/api/wallet/deposit')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 50, // Less than minimum 100
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBeFalsy();
    });

    it('should return error for amount more than maximum', async () => {
      const response = await request(app)
        .post('/api/wallet/deposit')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 200000, // More than maximum 100,000
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBeFalsy();
    });
  });

  describe('POST /api/wallet/withdraw', () => {
    beforeEach(async () => {
      // Reset balance to 1000 for each test
      await Wallet.findOneAndUpdate(
        { playerId },
        { balance: 1000 }
      );
    });

    it('should withdraw amount from wallet', async () => {
      const response = await request(app)
        .post('/api/wallet/withdraw')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 500,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('wallet');
      expect(response.body.data.wallet.balance).toBe(500);
    });

    it('should return error for insufficient balance', async () => {
      const response = await request(app)
        .post('/api/wallet/withdraw')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 2000, // More than available balance
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBeFalsy();
      expect(response.body.message).toBe('Insufficient balance');
    });
  });
});
