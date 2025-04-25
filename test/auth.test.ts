// test/auth.test.ts
import request from 'supertest';
import mongoose from 'mongoose';
import App from '../src/app';
import { Player } from '../src/models/player.model';
import { Wallet } from '../src/models/wallet.model';

const app = new App().app;

describe('Auth Controller', () => {
  beforeAll(async () => {
    // Connect to test database
    const MONGODB_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/player-referral-api-test';
    await mongoose.connect(MONGODB_URI);
  });

  afterAll(async () => {
    // Clean up and close connection
    await Player.deleteMany({});
    await Wallet.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up collections before each test
    await Player.deleteMany({});
    await Wallet.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new player', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Player',
          phoneNumber: '+1234567890',
          password: 'password123',
        })
        .set('Origin', 'https://example.com');

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('player');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.player).toHaveProperty('id');
      expect(response.body.data.player.name).toBe('Test Player');
      expect(response.body.data.player.phoneNumber).toBe('+1234567890');

      // Check if wallet was created
      const playerId = response.body.data.player.id;
      const wallet = await Wallet.findOne({ playerId });
      expect(wallet).toBeTruthy();
      expect(wallet?.balance).toBe(0);
    });

    it('should return error for duplicate phone number', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Player',
          phoneNumber: '+1234567890',
          password: 'password123',
        })
        .set('Origin', 'https://example.com');

      // Duplicate registration
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Another Player',
          phoneNumber: '+1234567890',
          password: 'password456',
        })
        .set('Origin', 'https://example.com');

      expect(response.status).toBe(409);
      expect(response.body.success).toBeFalsy();
      expect(response.body.message).toBe('Phone number already registered');
    });

    it('should return validation error for invalid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'T', // Too short
          phoneNumber: '123', // Invalid format
          password: 'pw', // Too short
        })
        .set('Origin', 'https://example.com');

      expect(response.status).toBe(400);
      expect(response.body.success).toBeFalsy();
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test player for login tests
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Player',
          phoneNumber: '+1234567890',
          password: 'password123',
        })
        .set('Origin', 'https://example.com');
    });

    it('should login an existing player', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          phoneNumber: '+1234567890',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('player');
      expect(response.body.data).toHaveProperty('token');
    });

    it('should return error for incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          phoneNumber: '+1234567890',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBeFalsy();
      expect(response.body.message).toBe('Invalid phone number or password');
    });

    it('should return error for non-existent phone number', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          phoneNumber: '+9876543210',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBeFalsy();
      expect(response.body.message).toBe('Invalid phone number or password');
    });
  });
});




