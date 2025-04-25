// src/utils/id.generator.ts
/**
 * Generates a unique player ID with 5 alphabetic characters [a-z] 
 * followed by 5 numeric characters [0-9]
 */
export class IdGenerator {
    public static generatePlayerId(): string {
      const characters = 'abcdefghijklmnopqrstuvwxyz';
      const numbers = '0123456789';
      let playerId = '';
      
      // Generate 5 alphabetic characters
      for (let i = 0; i < 5; i++) {
        playerId += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      
      // Generate 5 numeric characters
      for (let i = 0; i < 5; i++) {
        playerId += numbers.charAt(Math.floor(Math.random() * numbers.length));
      }
      
      return playerId;
    }
    
    /**
     * Generates a unique referral code based on player ID
     */
    public static generateReferralCode(playerId: string): string {
      return `REF-${playerId}`;
    }
  }
  
  // src/utils/error.handler.ts
  import { IHttpException } from '../interfaces/error.interface';
  
  export class HttpException implements IHttpException {
    public status: number;
    public message: string;
    
    constructor(status: number, message: string) {
      this.status = status;
      this.message = message;
    }
  }
  
  export class BadRequestException extends HttpException {
    constructor(message: string = 'Bad request') {
      super(400, message);
    }
  }
  
  export class UnauthorizedException extends HttpException {
    constructor(message: string = 'Unauthorized') {
      super(401, message);
    }
  }
  
  export class NotFoundException extends HttpException {
    constructor(message: string = 'Not found') {
      super(404, message);
    }
  }
  
  export class ConflictException extends HttpException {
    constructor(message: string = 'Conflict') {
      super(409, message);
    }
  }
  
  export class InternalServerErrorException extends HttpException {
    constructor(message: string = 'Internal server error') {
      super(500, message);
    }
  }
  
  // src/utils/logger.ts
  export const logger = {
    info: (message: string, ...args: any[]): void => {
      console.log(`[INFO] ${message}`, ...args);
    },
    
    error: (message: string, ...args: any[]): void => {
      console.error(`[ERROR] ${message}`, ...args);
    },
    
    warn: (message: string, ...args: any[]): void => {
      console.warn(`[WARN] ${message}`, ...args);
    },
    
    debug: (message: string, ...args: any[]): void => {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  };
  
  // src/utils/validator.ts
  import Joi from 'joi';
  import { IPlayerRegisterDto, IPlayerLoginDto } from '../interfaces/player.interface';
  import { IDepositDto, IWithdrawalDto } from '../interfaces/wallet.interface';
  
  export class Validator {
    public static validatePlayerRegistration(data: IPlayerRegisterDto): Joi.ValidationResult {
      const schema = Joi.object({
        name: Joi.string().required().min(3).max(50),
        phoneNumber: Joi.string().required().pattern(/^\+?[0-9]{10,14}$/),
        password: Joi.string().required().min(6),
        referralCode: Joi.string().optional()
      });
      
      return schema.validate(data);
    }
    
    public static validatePlayerLogin(data: IPlayerLoginDto): Joi.ValidationResult {
      const schema = Joi.object({
        phoneNumber: Joi.string().required(),
        password: Joi.string().required()
      });
      
      return schema.validate(data);
    }
    
    public static validateDeposit(data: IDepositDto): Joi.ValidationResult {
      const schema = Joi.object({
        amount: Joi.number().required().min(100).max(100000)
      });
      
      return schema.validate(data);
    }
    
    public static validateWithdrawal(data: IWithdrawalDto): Joi.ValidationResult {
      const schema = Joi.object({
        amount: Joi.number().required().min(1)
      });
      
      return schema.validate(data);
    }
  }