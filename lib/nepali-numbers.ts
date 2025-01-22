import { expandNumber } from './utils/number-expansion';
import { processDecimalNumber, processRupees } from './utils/text-processing';
import { processTime } from './utils/time-processing';
import { expandShortForms } from './utils/short-form-processing';

export function normalizeNumbers(text: string): string {
  // First expand short forms
  text = expandShortForms(text);

  // Remove commas from numbers
  text = text.replace(/([०-९][०-९,]+[०-९])/g, match => 
    match.replace(/,/g, ''));

  // Convert time expressions
  text = text.replace(/[०-९]{1,2}(?::[०-९]{1,2}){1,2}(?:\s*(?:बिहान|दिउँसो|साँझ|राति))?/g, match =>
    processTime(match));

  // Convert rupees
  text = text.replace(/रु(?:\s)?([०-९,]*[०-९]+)/g, (_, match) => 
    processRupees(match));

  // Convert decimal numbers
  text = text.replace(/([०-९]+\.[०-९]+)/g, match => 
    processDecimalNumber(match));

  // Convert regular numbers
  text = text.replace(/[०-९]+/g, match => 
    expandNumber(match));

  return text;
}