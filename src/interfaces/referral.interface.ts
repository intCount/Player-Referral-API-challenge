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
  