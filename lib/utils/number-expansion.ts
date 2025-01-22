import { NEPALI_NUMBERS } from '../constants/nepali-numbers';
import { nepaliToEnglishNum, englishToNepaliNum } from './digit-conversion';
import { processPhoneNumber } from './phone-processing';
import { cleanupNumber } from './format-utils';

interface NumberParts {
  crores: number;
  lakhs: number;
  thousands: number;
  hundreds: number;
  remainder: number;
}

function splitNumber(num: number): NumberParts {
  return {
    crores: Math.floor(num / 10000000),
    lakhs: Math.floor((num % 10000000) / 100000),
    thousands: Math.floor((num % 100000) / 1000),
    hundreds: Math.floor((num % 1000) / 100),
    remainder: num % 100
  };
}

export function expandNumber(nepaliNumStr: string): string {
  const cleanNum = cleanupNumber(nepaliNumStr);
  
  // Handle phone numbers (10 digits starting with 9)
  if (cleanNum.length === 10 && cleanNum.startsWith('९')) {
    return processPhoneNumber(cleanNum);
  }

  // Handle predefined numbers
  if (NEPALI_NUMBERS[cleanNum]) {
    return NEPALI_NUMBERS[cleanNum][0];
  }

  let num = parseInt(nepaliToEnglishNum(cleanNum));
  const parts = splitNumber(num);
  const result: string[] = [];

  // Process each number part
  if (parts.crores > 0) {
    result.push(parts.crores > 1
      ? `${expandNumber(englishToNepaliNum(parts.crores))} करोड`
      : NEPALI_NUMBERS['१००००००००'][0]
    );
  }

  if (parts.lakhs > 0) {
    result.push(parts.lakhs > 1 || result.length > 0
      ? `${expandNumber(englishToNepaliNum(parts.lakhs))} लाख`
      : NEPALI_NUMBERS['१००००००'][0]
    );
  }

  if (parts.thousands > 0) {
    result.push(parts.thousands > 1 || result.length > 0
      ? `${expandNumber(englishToNepaliNum(parts.thousands))} हजार`
      : NEPALI_NUMBERS['१०००'][0]
    );
  }

  if (parts.hundreds > 0) {
    result.push(parts.hundreds > 1 || result.length > 0
      ? `${expandNumber(englishToNepaliNum(parts.hundreds))} सय`
      : NEPALI_NUMBERS['१००'][0]
    );
  }

  if (parts.remainder > 0) {
    const remainderStr = englishToNepaliNum(parts.remainder);
    result.push(NEPALI_NUMBERS[remainderStr]?.[0] || remainderStr);
  }

  return result.join(' ');
}