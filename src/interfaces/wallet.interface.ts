// src/interfaces/wallet.interface.ts
export interface IWallet {
    playerId: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface ITransaction {
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'REFERRAL_BONUS' | 'REFERRAL_DEPOSIT_BONUS';
    amount: number;
    playerId: string;
    sourcePlayerId?: string;
    createdAt: Date;
  }
  
  export interface IDepositDto {
    amount: number;
  }
  
  export interface IWithdrawalDto {
    amount: number;
  }
  