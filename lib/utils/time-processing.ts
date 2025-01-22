import { NEPALI_NUMBERS } from '../constants/nepali-numbers';
import { nepaliToEnglishNum } from './digit-conversion';

export function processTime(timeStr: string): string {
  // Handle 24-hour format with optional seconds
  const hourFormat = /([०-९]{1,2}):([०-९]{1,2})(?::([०-९]{1,2}))?/;
  
  // Handle time with period indicators (बिहान, दिउँसो, साँझ, राति)
  const timeWithPeriod = /([०-९]{1,2})(?::([०-९]{1,2}))?(?::([०-९]{1,2}))?\s*(बिहान|दिउँसो|साँझ|राति)?/;
  
  if (timeWithPeriod.test(timeStr)) {
    const [_, hours, minutes, seconds, period] = timeStr.match(timeWithPeriod) || [];
    const expandedHours = NEPALI_NUMBERS[hours] || hours;
    let timeWords = [`${expandedHours} बजे`];
    
    if (minutes) {
      const expandedMinutes = NEPALI_NUMBERS[minutes] || minutes;
      timeWords.push(`${expandedMinutes} मिनेट`);
    }
    
    if (seconds) {
      const expandedSeconds = NEPALI_NUMBERS[seconds] || seconds;
      timeWords.push(`${expandedSeconds} सेकेन्ड`);
    }
    
    if (period) {
      timeWords.push(period);
    }
    
    return timeWords.join(' ');
  }
  
  return timeStr;
}