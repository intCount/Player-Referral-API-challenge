// src/interfaces/player.interface.ts
export interface IPlayer {
    id: string;
    name: string;
    phoneNumber: string;
    password: string;
    ipAddress: string;
    originUrl: string;
    referralCode: string;
    referredBy?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface IPlayerRegisterDto {
    name: string;
    phoneNumber: string;
    password: string;
    referralCode?: string;
  }
  
  export interface IPlayerLoginDto {
    phoneNumber: string;
    password: string;
  }
  
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
  
  // src/interfaces/referral.interface.ts
  export interface IReferral {
    referrerId: string;
    referredId: string;
    registrationBonus: boolean;
    depositBonuses: IDepositBonus[];
    createdAt: Date;
  }
  
  export interface IDepositBonus {
    amount: number;
    percentage: number;
    depositAmount: number;
    createdAt: Date;
  }
  
  export interface IReferralStats {
    totalReferrals: number;
    totalRegistrationBonus: number;
    totalDepositBonus: number;
  }
  
  // src/interfaces/error.interface.ts
  export interface IHttpException extends Error {
    status: number;
    message: string;
  }