// src/services/auth.service.ts
import jwt from 'jsonwebtoken';
import { IPlayerRegisterDto, IPlayerLoginDto } from '../interfaces/player.interface';
import { Player, IPlayerDocument } from '../models/player.model';
import { Wallet } from '../models/wallet.model';
import { IdGenerator } from '../utils/id.generator';
import { BadRequestException, ConflictException, UnauthorizedException } from '../utils/error.handler';
import { ReferralService } from './referral.service';

export class AuthService {
  private referralService: ReferralService;

  constructor() {
    this.referralService = new ReferralService();
  }

  public async register(playerData: IPlayerRegisterDto, ipAddress: string, originUrl: string): Promise<{ player: IPlayerDocument; token: string }> {
    try {
      // Check if phone number already exists
      const existingPlayer = await Player.findOne({ phoneNumber: playerData.phoneNumber });
      
      if (existingPlayer) {
        throw new ConflictException('Phone number already registered');
      }
      
      // Generate unique player ID
      const playerId = IdGenerator.generatePlayerId();
      
      // Generate referral code
      const referralCode = IdGenerator.generateReferralCode(playerId);
      
      // Create new player
      const player = new Player({
        id: playerId,
        name: playerData.name,
        phoneNumber: playerData.phoneNumber,
        password: playerData.password,
        ipAddress,
        originUrl,
        referralCode,
      });
      
      // Check if player was referred
      if (playerData.referralCode) {
        // Find referrer
        const referrer = await Player.findOne({ referralCode: playerData.referralCode });
        
        if (referrer) {
          player.referredBy = referrer.id;
          
          // Save the player first
          await player.save();
          
          // Create wallet with 0 balance
          await new Wallet({ playerId: player.id, balance: 0 }).save();
          
          // Process referral
          await this.referralService.processRegistrationReferral(referrer.id, player.id);
        } else {
          throw new BadRequestException('Invalid referral code');
        }
      } else {
        // No referral, just save player and create wallet
        await player.save();
        await new Wallet({ playerId: player.id, balance: 0 }).save();
      }
      
      // Generate JWT token
      const token = this.generateToken(player);
      
      return { player, token };
    } catch (error) {
      throw error;
    }
  }
  
  public async login(loginData: IPlayerLoginDto): Promise<{ player: IPlayerDocument; token: string }> {
    try {
      // Find player by phone number
      const player = await Player.findOne({ phoneNumber: loginData.phoneNumber });
      
      if (!player) {
        throw new UnauthorizedException('Invalid phone number or password');
      }
      
      // Verify password
      const isPasswordValid = await player.comparePassword(loginData.password);
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid phone number or password');
      }
      
      // Generate JWT token
      const token = this.generateToken(player);
      
      return { player, token };
    } catch (error) {
      throw error;
    }
  }
  
  private generateToken(player: IPlayerDocument): string {
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
    
    return jwt.sign(
      {
        id: player.id,
        phoneNumber: player.phoneNumber,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );
  }
}

// src/services/wallet.service.ts
import { Wallet, Transaction } from '../models/wallet.model';
import { BadRequestException, NotFoundException } from '../utils/error.handler';
import { ReferralService } from './referral.service';

export class WalletService {
  private referralService: ReferralService;

  constructor() {
    this.referralService = new ReferralService();
  }

  public async getWalletByPlayerId(playerId: string): Promise<any> {
    try {
      const wallet = await Wallet.findOne({ playerId });
      
      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }
      
      return wallet;
    } catch (error) {
      throw error;
    }
  }
  
  public async deposit(playerId: string, amount: number): Promise<any> {
    try {
      if (amount < 100 || amount > 100000) {
        throw new BadRequestException('Deposit amount must be between 100 and 100,000');
      }
      
      // Find wallet
      const wallet = await Wallet.findOne({ playerId });
      
      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }
      
      // Update wallet balance
      wallet.balance += amount;
      await wallet.save();
      
      // Record transaction
      await new Transaction({
        type: 'DEPOSIT',
        amount,
        playerId,
      }).save();
      
      // Process referral deposit if player was referred
      await this.referralService.processDepositReferral(playerId, amount);
      
      return wallet;
    } catch (error) {
      throw error;
    }
  }
  
  public async withdraw(playerId: string, amount: number): Promise<any> {
    try {
      // Find wallet
      const wallet = await Wallet.findOne({ playerId });
      
      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }
      
      // Check if wallet has sufficient balance
      if (wallet.balance < amount) {
        throw new BadRequestException('Insufficient balance');
      }
      
      // Update wallet balance
      wallet.balance -= amount;
      await wallet.save();
      
      // Record transaction
      await new Transaction({
        type: 'WITHDRAWAL',
        amount,
        playerId,
      }).save();
      
      return wallet;
    } catch (error) {
      throw error;
    }
  }
  
  public async getTransactionHistory(playerId: string): Promise<any> {
    try {
      const transactions = await Transaction.find({ playerId }).sort({ createdAt: -1 });
      
      return transactions;
    } catch (error) {
      throw error;
    }
  }
  
  public async creditReferralBonus(playerId: string, amount: number, sourcePlayerId: string, type: 'REFERRAL_BONUS' | 'REFERRAL_DEPOSIT_BONUS'): Promise<any> {
    try {
      // Find wallet
      const wallet = await Wallet.findOne({ playerId });
      
      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }
      
      // Update wallet balance
      wallet.balance += amount;
      await wallet.save();
      
      // Record transaction
      await new Transaction({
        type,
        amount,
        playerId,
        sourcePlayerId,
      }).save();
      
      return wallet;
    } catch (error) {
      throw error;
    }
  }
}

// src/services/referral.service.ts
import { Player } from '../models/player.model';
import { Referral } from '../models/referral.model';
import { NotFoundException } from '../utils/error.handler';
import { WalletService } from './wallet.service';

export class ReferralService {
  private walletService!: WalletService;

  constructor() {
    // Handle circular dependency
    // Will initialize in relevant methods
  }

  private initWalletService(): void {
    if (!this.walletService) {
      this.walletService = new WalletService();
    }
  }

  public async processRegistrationReferral(referrerId: string, referredId: string): Promise<void> {
    try {
      this.initWalletService();
      
      // Create referral record
      const referral = new Referral({
        referrerId,
        referredId,
        registrationBonus: true,
        depositBonuses: [],
      });
      
      await referral.save();
      
      // Credit bonus to referrer (100 units)
      const REGISTRATION_BONUS = 100;
      await this.walletService.creditReferral