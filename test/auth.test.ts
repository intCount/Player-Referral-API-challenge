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