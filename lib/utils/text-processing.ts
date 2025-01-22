import { NEPALI_NUMBERS, ORDINAL_NUMBERS, SPECIAL_FORMATS } from '../constants/nepali-numbers';
import { nepaliToEnglishNum, englishToNepaliNum } from './digit-conversion';

function getAllVariations(number: string): string[] {
  const variations: string[] = [];
  
  // Get primary variations from NEPALI_NUMBERS
  if (NEPALI_NUMBERS[number]) {
    variations.push(...NEPALI_NUMBERS[number]);
  }
  
  // Get ordinal variations
  if (ORDINAL_NUMBERS[number]) {
    variations.push(...ORDINAL_NUMBERS[number]);
  }
  
  return [...new Set(variations)]; // Remove duplicates
}

function formatVariations(variations: string[]): string {
  if (variations.length <= 1) return '';
  
  return '\nवैकल्पिक उच्चारणहरू:\n' + 
    variations.slice(1).map(v => `• ${v}`).join('\n');
}

function expandPhoneNumber(nepaliNumStr: string): string {
  const { mobile, landline, tollFree } = SPECIAL_FORMATS.phone;
  let result = '';
  
  if (mobile.test(nepaliNumStr)) {
    // Mobile number format: ९८xxxxxxxx
    const parts = [
      nepaliNumStr.slice(0, 2),
      nepaliNumStr.slice(2, 4),
      nepaliNumStr.slice(4, 7),
      nepaliNumStr.slice(7)
    ];
    result = parts.map(part => NEPALI_NUMBERS[part]?.[0] || 
      Array.from(part).map(digit => NEPALI_NUMBERS[digit]?.[0]).join(' ')
    ).join(' ');
  } else if (landline.test(nepaliNumStr)) {
    // Landline format: 0x-xxxxxxx
    result = Array.from(nepaliNumStr).map(digit => 
      NEPALI_NUMBERS[digit]?.[0]).join(' ');
  } else if (tollFree.test(nepaliNumStr)) {
    // Toll-free format: 166-xxxxxxx
    result = Array.from(nepaliNumStr).map(digit => 
      NEPALI_NUMBERS[digit]?.[0]).join(' ');
  } else {
    // Default digit-by-digit expansion
    result = Array.from(nepaliNumStr).map(digit => 
      NEPALI_NUMBERS[digit]?.[0]).join(' ');
  }
  
  return result;
}

export function processDecimalNumber(match: string): string {
  const [whole, decimal] = match.split('.');
  const expandedWhole = expandNumber(whole);
  const expandedDecimal = Array.from(decimal)
    .map(digit => NEPALI_NUMBERS[digit]?.[0])
    .join(' ');
  
  const variations = getAllVariations(whole);
  let result = `${expandedWhole} दशमलव ${expandedDecimal}`;
  
  if (variations.length > 1) {
    result += formatVariations(variations);
  }
  
  return result;
}

export function processRupees(amount: string): string {
  const [rupees, paisa] = amount.split('.');
  const cleanRupees = rupees.replace(/,/g, '');
  const expandedRupees = expandNumber(cleanRupees);
  const variations = getAllVariations(cleanRupees);
  
  let result = `${expandedRupees} रुपैयाँ`;
  
  if (variations.length > 1) {
    result += formatVariations(variations);
  }
  
  if (paisa) {
    const expandedPaisa = expandNumber(paisa);
    const paisaVariations = getAllVariations(paisa);
    result += ` ${expandedPaisa} पैसा`;
    
    if (paisaVariations.length > 1) {
      result += formatVariations(paisaVariations);
    }
  }
  
  return result;
}

export function expandNumber(nepaliNumStr: string): string {
  // Handle phone numbers
  if (nepaliNumStr.length >= 8 && nepaliNumStr.length <= 11) {
    return expandPhoneNumber(nepaliNumStr);
  }

  // Handle predefined numbers
  if (NEPALI_NUMBERS[nepaliNumStr]) {
    return NEPALI_NUMBERS[nepaliNumStr][0];
  }

  let parsedNum = parseInt(nepaliToEnglishNum(nepaliNumStr));
  const result: string[] = [];

  // Process crores (१००००००००)
  if (parsedNum >= 10000000) {
    const crores = Math.floor(parsedNum / 10000000);
    result.push(crores > 1 
      ? `${expandNumber(englishToNepaliNum(crores))} करोड`
      : NEPALI_NUMBERS['१००००००००'][0]
    );
    parsedNum %= 10000000;
  }

  // Process lakhs (१०००००)
  if (parsedNum >= 100000) {
    const lakhs = Math.floor(parsedNum / 100000);
    result.push(lakhs > 1 || result.length > 0
      ? `${expandNumber(englishToNepaliNum(lakhs))} लाख`
      : NEPALI_NUMBERS['१००००००'][0]
    );
    parsedNum %= 100000;
  }

  // Process thousands (१०००)
  if (parsedNum >= 1000) {
    const thousands = Math.floor(parsedNum / 1000);
    result.push(thousands > 1 || result.length > 0
      ? `${expandNumber(englishToNepaliNum(thousands))} हजार`
      : NEPALI_NUMBERS['१०००'][0]
    );
    parsedNum %= 1000;
  }

  // Process hundreds (१००)
  if (parsedNum >= 100) {
    const hundreds = Math.floor(parsedNum / 100);
    result.push(hundreds > 1 || result.length > 0
      ? `${expandNumber(englishToNepaliNum(hundreds))} सय`
      : NEPALI_NUMBERS['१००'][0]
    );
    parsedNum %= 100;
  }

  // Process remaining two digits
  if (parsedNum > 0) {
    const numStr = englishToNepaliNum(parsedNum);
    result.push(NEPALI_NUMBERS[numStr]?.[0] || numStr);
  }

  return result.join(' ');
}

export function normalizeNumbers(text: string): string {
  // Split text into lines for processing
  const lines = text.split('\n');
  const processedLines = lines.map(line => {
    let processedLine = line;
    
    // Remove commas from numbers
    processedLine = processedLine.replace(/([०-९][०-९,]+[०-९])/g, match => 
      match.replace(/,/g, ''));

    // Convert time expressions
    processedLine = processedLine.replace(
      SPECIAL_FORMATS.time.full,
      (_, hours, minutes, seconds, period) => {
        let result = `${expandNumber(hours)} बजे`;
        if (minutes) result += ` ${expandNumber(minutes)} मिनेट`;
        if (seconds) result += ` ${expandNumber(seconds)} सेकेन्ड`;
        if (period) result += ` ${period}`;
        return result;
      }
    );

    // Convert rupees
    processedLine = processedLine.replace(
      SPECIAL_FORMATS.currency.rupees,
      (_, rupees, paisa) => processRupees(rupees + (paisa ? `.${paisa}` : ''))
    );

    // Convert decimal numbers
    processedLine = processedLine.replace(/([०-९]+\.[०-९]+)/g, match => 
      processDecimalNumber(match));

    // Convert regular numbers
    processedLine = processedLine.replace(/[०-९]+/g, match => {
      const expanded = expandNumber(match);
      const variations = getAllVariations(match);
      return variations.length > 1
        ? `${expanded}${formatVariations(variations)}`
        : expanded;
    });

    return processedLine;
  });

  return processedLines.join('\n\n');
}