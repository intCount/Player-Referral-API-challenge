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
  
  
  
  
  
  