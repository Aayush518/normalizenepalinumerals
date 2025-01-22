import { NEPALI_NUMBERS } from '../constants/nepali-numbers';
import { expandNumber } from './number-expansion';
import { cleanupNumber } from './format-utils';

// Phone number patterns
const PHONE_PATTERNS = {
  MOBILE_PREFIX: /^(९७|९८)/,
  LANDLINE_PREFIX: /^०[१-९]/,
  TOLL_FREE_PREFIX: /^१६६/
};

export function processPhoneNumber(number: string): string {
  // Strip any spaces or dashes
  const cleanNumber = cleanupNumber(number);
  
  if (cleanNumber.length === 10) {
    // Mobile numbers (98xxxxxxxx or 97xxxxxxxx)
    if (PHONE_PATTERNS.MOBILE_PREFIX.test(cleanNumber)) {
      // Group in the 2-2-3-3 pattern
      const groups = [
        cleanNumber.slice(0, 2),   // First pair (98)
        cleanNumber.slice(2, 4),   // Second pair (45)
        cleanNumber.slice(4, 7),   // Three digits (234)
        cleanNumber.slice(7)       // Last three digits (567)
      ];
      
      return groups
        .map(group => expandNumber(group))
        .join(' ');
    }
    
    // Landline numbers (01xxxxxxx)
    if (PHONE_PATTERNS.LANDLINE_PREFIX.test(cleanNumber)) {
      const parts = [
        cleanNumber.slice(0, 2),  // Area code
        cleanNumber.slice(2, 6),  // First half
        cleanNumber.slice(6)      // Second half
      ];
      
      return parts
        .map(part => expandNumber(part))
        .join(' ');
    }
  }
  
  // Toll-free numbers (166xxxxxxx)
  if (PHONE_PATTERNS.TOLL_FREE_PREFIX.test(cleanNumber)) {
    const parts = [
      cleanNumber.slice(0, 3),  // Prefix (166)
      cleanNumber.slice(3, 6),  // Middle
      cleanNumber.slice(6)      // End
    ];
    
    return parts
      .map(part => expandNumber(part))
      .join(' ');
  }
  
  // Default: expand the entire number
  return expandNumber(cleanNumber);
}