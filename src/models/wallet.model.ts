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
