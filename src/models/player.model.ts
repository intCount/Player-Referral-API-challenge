// src/models/player.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IPlayer } from '../interfaces/player.interface';
import bcrypt from 'bcrypt';

export interface IPlayerDocument extends IPlayer, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const playerSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    originUrl: {
      type: String,
      required: true,
    },
    referralCode: {
      type: String,
      required: true,
      unique: true,
    },
    referredBy: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
playerSchema.pre<IPlayerDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
playerSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const Player = mongoose.model<IPlayerDocument>('Player', playerSchema);

// src/models/wallet.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IWallet, ITransaction } from '../interfaces/wallet.interface';

export interface IWalletDocument extends IWallet, Document {}
export interface ITransactionDocument extends ITransaction, Document {}

const walletSchema: Schema = new Schema(
  {
    playerId: {
      type: String,
      required: true,
      unique: true,
      ref: 'Player',
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const transactionSchema: Schema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['DEPOSIT', 'WITHDRAWAL', 'REFERRAL_BONUS', 'REFERRAL_DEPOSIT_BONUS'],
    },
    amount: {
      type: Number,
      required: true,
    },
    playerId: {
      type: String,
      required: true,
      ref: 'Player',
    },
    sourcePlayerId: {
      type: String,
      required: false,
      ref: 'Player',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

export const Wallet = mongoose.model<IWalletDocument>('Wallet', walletSchema);
export const Transaction = mongoose.model<ITransactionDocument>('Transaction', transactionSchema);

// src/models/referral.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IReferral, IDepositBonus } from '../interfaces/referral.interface';

export interface IReferralDocument extends IReferral, Document {}

const depositBonusSchema: Schema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
      default: 10,
    },
    depositAmount: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const referralSchema: Schema = new Schema(
  {
    referrerId: {
      type: String,
      required: true,
      ref: 'Player',
    },
    referredId: {
      type: String,
      required: true,
      ref: 'Player',
    },
    registrationBonus: {
      type: Boolean,
      required: true,
      default: false,
    },
    depositBonuses: [depositBonusSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

// Compound index to ensure a player can only be referred once
referralSchema.index({ referrerId: 1, referredId: 1 }, { unique: true });

export const Referral = mongoose.model<IReferralDocument>('Referral', referralSchema);