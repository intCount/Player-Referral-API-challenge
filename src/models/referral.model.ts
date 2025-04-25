// src/models/referral.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IReferral } from '../interfaces/referral.interface';

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