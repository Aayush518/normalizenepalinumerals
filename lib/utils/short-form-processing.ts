import { SHORT_FORMS } from '../constants/nepali-numbers';

export function expandShortForms(text: string): string {
  let result = text;
  
  // Sort by length (descending) to handle longer matches first
  const sortedShortForms = Object.entries(SHORT_FORMS)
    .sort(([a], [b]) => b.length - a.length);
  
  for (const [short, full] of sortedShortForms) {
    const regex = new RegExp(`\\b${short}\\b`, 'g');
    result = result.replace(regex, full);
  }
  
  return result;
}