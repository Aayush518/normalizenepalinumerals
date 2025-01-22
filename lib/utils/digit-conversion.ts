import { NEPALI_TO_ENGLISH, ENGLISH_TO_NEPALI } from '../constants/digit-maps';

export function nepaliToEnglishNum(nepaliNum: string): string {
  return Array.from(nepaliNum)
    .map(char => NEPALI_TO_ENGLISH[char] || char)
    .join('');
}

export function englishToNepaliNum(englishNum: string | number): string {
  return Array.from(String(englishNum))
    .map(char => ENGLISH_TO_NEPALI[char] || char)
    .join('');
}