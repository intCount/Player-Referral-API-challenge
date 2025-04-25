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
      await this.walletService.creditReferralBonus(
        referrerId,
        REGISTRATION_BONUS,
        referredId,
        'REFERRAL_BONUS'
      );
    } catch (error) {
      throw error;
    }
  }

  public async processDepositReferral(playerId: string, depositAmount: number): Promise<void> {
    try {
      this.initWalletService();
      
      // Find if player was referred
      const player = await Player.findOne({ id: playerId });
      
      if (!player || !player.referredBy) {
        return; // Not referred, no bonus to process
      }
      
      // Find referral record
      const referral = await Referral.findOne({
        referrerId: player.referredBy,
        referredId: playerId,
      });
      
      if (!referral) {
        return; // No referral record found
      }
      
      // Calculate deposit bonus (10% of deposit amount)
      const BONUS_PERCENTAGE = 10;
      const bonusAmount = (depositAmount * BONUS_PERCENTAGE) / 100;
      
      // Update referral record
      referral.depositBonuses.push({
        amount: bonusAmount,
        percentage: BONUS_PERCENTAGE,
        depositAmount,
        createdAt: new Date(),
      });
      
      await referral.save();
      
      // Credit bonus to referrer
      await this.walletService.creditReferralBonus(
        player.referredBy,
        bonusAmount,
        playerId,
        'REFERRAL_DEPOSIT_BONUS'
      );
    } catch (error) {
      throw error;
    }
  }

  public async generateReferralLink(playerId: string, baseUrl: string): Promise<string> {
    try {
      const player = await Player.findOne({ id: playerId });
      
      if (!player) {
        throw new NotFoundException('Player not found');
      }
      
      return `${baseUrl}/register?ref=${player.referralCode}`;
    } catch (error) {
      throw error;
    }
  }

  public async getReferredPlayers(referrerId: string): Promise<any[]> {
    try {
      // Find all referrals where this player is the referrer
      const referrals = await Referral.find({ referrerId });
      
      if (!referrals.length) {
        return [];
      }
      
      // Get referred player IDs
      const referredIds = referrals.map((referral) => referral.referredId);
      
      // Find all referred players
      const referredPlayers = await Player.find({ id: { $in: referredIds } });
      
      // Return only necessary player info
      return referredPlayers.map((player) => ({
        id: player.id,
        name: player.name,
        phoneNumber: player.phoneNumber,
        referralCode: player.referralCode,
        createdAt: player.createdAt,
      }));
    } catch (error) {
      throw error;
    }
  }

  public async getReferralStats(referrerId: string): Promise<any> {
    try {
      // Find all referrals where this player is the referrer
      const referrals = await Referral.find({ referrerId });
      
      if (!referrals.length) {
        return {
          totalReferrals: 0,
          totalRegistrationBonus: 0,
          totalDepositBonus: 0,
        };
      }
      
      // Calculate stats
      const totalReferrals = referrals.length;
      const totalRegistrationBonus = referrals.filter((r) => r.registrationBonus).length * 100;
      
      let totalDepositBonus = 0;
      referrals.forEach((referral) => {
        referral.depositBonuses.forEach((bonus) => {
          totalDepositBonus += bonus.amount;
        });
      });
      
      return {
        totalReferrals,
        totalRegistrationBonus,
        totalDepositBonus,
      };
    } catch (error) {
      throw error;
    }
  }
}