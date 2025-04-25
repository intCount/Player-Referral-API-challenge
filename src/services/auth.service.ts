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
    
    const payload = {
      id: player.id,
      phoneNumber: player.phoneNumber,
    };
    
    // Fix the JWT sign call with proper typing
    return jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }
}