import { NEPALI_NUMBERS } from '../constants/nepali-numbers';
import { expandNumber } from './number-expansion';
import { formatVariations } from './format-utils';

export function processCurrency(amount: string): string {
  // Remove commas and spaces
  const cleanAmount = amount.replace(/[,\s]/g, '');
  const [rupees, paisa] = cleanAmount.split('.');
  
  const expandedRupees = expandNumber(rupees);
  let result = `${expandedRupees} रुपैयाँ`;
  
  // Add paisa if present
  if (paisa) {
    const expandedPaisa = expandNumber(paisa.padEnd(2, '०'));
    result += ` ${expandedPaisa} पैसा`;
  }
  
  return result;
}