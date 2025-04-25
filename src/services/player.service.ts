// src/services/player.service.ts
import { Player } from '../models/player.model';
import { Wallet } from '../models/wallet.model';
import { NotFoundException } from '../utils/error.handler';

export class PlayerService {
  public async getPlayerProfile(playerId: string): Promise<any> {
    try {
      const player = await Player.findOne({ id: playerId });
      
      if (!player) {
        throw new NotFoundException('Player not found');
      }
      
      // Find player's wallet
      const wallet = await Wallet.findOne({ playerId });
      
      return {
        id: player.id,
        name: player.name,
        phoneNumber: player.phoneNumber,
        referralCode: player.referralCode,
        balance: wallet ? wallet.balance : 0,
        registeredAt: player.createdAt,
      };
    } catch (error) {
      throw error;
    }
  }
}