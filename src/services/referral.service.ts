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