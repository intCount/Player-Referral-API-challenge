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