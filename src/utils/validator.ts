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