export function formatVariations(variations: string[]): string {
  if (!variations || variations.length <= 1) return '';
  
  return '\nवैकल्पिक उच्चारणहरू:\n' + 
    variations.slice(1).map(v => `• ${v}`).join('\n');
}

export function stripExtraSpaces(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function cleanupNumber(number: string): string {
  return number.replace(/[,\s]/g, '');
}