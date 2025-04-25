// test/player.test.ts
import request from 'supertest';
import mongoose from 'mongoose';
import App from '../src/app';
import { Player } from '../src/models/player.model';
import { Wallet } from '../src/models/wallet.model';

const app = new App().app;
let token: string;
let playerId: string;

describe('Player Controller', () => {
  beforeAll(async () => {
    // Connect to test database
    const MONGODB_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/player-referral-api-test';
    await mongoose.connect(MONGODB_URI);

    // Create a test player
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Player Test',
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

  describe('GET /api/players/profile', () => {
    it('should get player profile', async () => {
      const response = await request(app)
        .get('/api/players/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('profile');
      expect(response.body.data.profile.id).toBe(playerId);
      expect(response.body.data.profile.name).toBe('Player Test');
      expect(response.body.data.profile.phoneNumber).toBe('+1234567890');
      expect(response.body.data.profile).toHaveProperty('referralCode');
      expect(response.body.data.profile).not.toHaveProperty('password');
    });

    it('should return error without auth token', async () => {
      const response = await request(app).get('/api/players/profile');

      expect(response.status).toBe(401);
      expect(response.body.success).toBeFalsy();
    });
  });
});