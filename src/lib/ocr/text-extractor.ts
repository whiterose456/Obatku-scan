import { recognizeText } from './tesseract-engine';

export async function extractTextFromImage(
  imageSource: string | HTMLImageElement
): Promise<string> {
  try {
    const text = await recognizeText(imageSource);
    return text;
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error('Failed to extract text from image');
  }
}

export function filterExpiryRelatedText(text: string): string[] {
  const lines = text.split('\n');
  const expiryKeywords = [
    'exp',
    'kadaluarsa',
    'expiry',
    'expire',
    'tanggal',
    'date',
    'bulan',
    'tahun',
    '/',
  ];

  return lines.filter((line) => {
    const lowerLine = line.toLowerCase();
    return expiryKeywords.some((keyword) => lowerLine.includes(keyword));
  });
}
