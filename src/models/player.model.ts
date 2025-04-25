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


