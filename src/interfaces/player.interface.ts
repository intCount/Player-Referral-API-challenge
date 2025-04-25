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
  
  
 
 