// test/referral.test.ts
import request from 'supertest';
import mongoose from 'mongoose';
import App from '../src/app';
import { Player } from '../src/models/player.model';
import { Wallet } from '../src/models/wallet.model';
import { Referral } from '../src/models/referral.model';

const app = new App().app;
let parentToken: string;
let parentPlayer: any;
let childToken: string;
let childPlayer: any;

describe('Referral Controller', () => {
  beforeAll(async () => {
    // Connect to test database
    const MONGODB_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/player-referral-api-test';
    await mongoose.connect(MONGODB_URI);

    // Create parent player
    const parentResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Parent Player',
        phoneNumber: '+1234567890',
        password: 'password123',
      })
      .set('Origin', 'https://example.com');

    parentToken = parentResponse.body.data.token;
    parentPlayer = parentResponse.body.data.player;

    // Get referral link
    const linkResponse = await request(app)
      .get('/api/referrals/link')
      .set('Authorization', `Bearer ${parentToken}`);

    const referralCode = parentPlayer.referralCode;

    // Register child player with referral code
    const childResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Child Player',
        phoneNumber: '+9876543210',
        password: 'password456',
        referralCode,
      })
      .set('Origin', 'https://example.com');

    childToken = childResponse.body.data.token;
    childPlayer = childResponse.body.data.player;
  });

  afterAll(async () => {
    // Clean up and close connection
    await Player.deleteMany({});
    await Wallet.deleteMany({});
    await Referral.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/referrals/link', () => {
    it('should generate referral link', async () => {
      const response = await request(app)
        .get('/api/referrals/link')
        .set('Authorization', `Bearer ${parentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('referralLink');
      expect(response.body.data.referralLink).toContain(parentPlayer.referralCode);
    });

    it('should return error without auth token', async () => {
      const response = await request(app).get('/api/referrals/link');

      expect(response.status).toBe(401);
      expect(response.body.success).toBeFalsy();
    });
  });

  describe('GET /api/referrals/players', () => {
    it('should get list of referred players', async () => {
      const response = await request(app)
        .get('/api/referrals/players')
        .set('Authorization', `Bearer ${parentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('referredPlayers');
      expect(response.body.data).toHaveProperty('count');
      expect(response.body.data.count).toBe(1);
      expect(response.body.data.referredPlayers[0].id).toBe(childPlayer.id);
    });
  });

  describe('GET /api/referrals/stats', () => {
    it('should get referral stats', async () => {
      const response = await request(app)
        .get('/api/referrals/stats')
        .set('Authorization', `Bearer ${parentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('stats');
      expect(response.body.data.stats).toHaveProperty('totalReferrals');
      expect(response.body.data.stats).toHaveProperty('totalRegistrationBonus');
      expect(response.body.data.stats).toHaveProperty('totalDepositBonus');
      expect(response.body.data.stats.totalReferrals).toBe(1);
      expect(response.body.data.stats.totalRegistrationBonus).toBe(100);
    });
  });

  describe('Deposit bonus system', () => {
    it('should credit 10% referral bonus on deposit', async () => {
      // Get parent wallet before deposit
      const beforeResponse = await request(app)
        .get('/api/wallet')
        .set('Authorization', `Bearer ${parentToken}`);
      
      const beforeBalance = beforeResponse.body.data.wallet.balance;

      // Child makes a deposit
      await request(app)
        .post('/api/wallet/deposit')
        .set('Authorization', `Bearer ${childToken}`)
        .send({
          amount: 1000,
        });

      // Check parent wallet after deposit
      const afterResponse = await request(app)
        .get('/api/wallet')
        .set('Authorization', `Bearer ${parentToken}`);
      
      const afterBalance = afterResponse.body.data.wallet.balance;
      const expectedBonus = 100; // 10% of 1000

      expect(afterBalance).toBe(beforeBalance + expectedBonus);

      // Check referral stats
      const statsResponse = await request(app)
        .get('/api/referrals/stats')
        .set('Authorization', `Bearer ${parentToken}`);

      expect(statsResponse.body.data.stats.totalDepositBonus).toBe(expectedBonus);
    });
  });
});