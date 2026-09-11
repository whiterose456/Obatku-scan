export interface ParsedDate {
  date: Date;
  confidence: number;
  format: string;
  originalString: string;
}

const monthNamesIndonesian: Record<string, number> = {
  jan: 0,
  januari: 0,
  feb: 1,
  februari: 1,
  mar: 2,
  maret: 2,
  apr: 3,
  april: 3,
  mei: 4,
  jun: 5,
  juni: 5,
  jul: 6,
  juli: 6,
  agu: 7,
  agustus: 7,
  sep: 8,
  september: 8,
  okt: 9,
  oktober: 9,
  nov: 10,
  november: 10,
  des: 11,
  desember: 11,
};

export function parseExpiryDate(text: string): ParsedDate | null {
  // Common Indonesian expiry date patterns
  const patterns = [
    // DD/MM/YYYY or MM/DD/YYYY
    /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/,
    // MM/YYYY or MM/YY
    /(\d{1,2})\/(\d{2,4})/,
    // Month Year (e.g., "Des 2025", "December 2025")
    /(jan|feb|mar|apr|mei|jun|jul|agu|sep|okt|nov|des|januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)\s*(\d{2,4})/i,
    // Exp: DD/MM/YYYY
    /exp.*?(\d{1,2})\/(\d{1,2})\/(\d{2,4})/i,
    // Kadaluarsa: DD/MM/YYYY
    /kadaluarsa.*?(\d{1,2})\/(\d{1,2})\/(\d{2,4})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const parsed = tryParseMatch(match, pattern);
      if (parsed) {
        return parsed;
      }
    }
  }

  return null;
}

function tryParseMatch(
  match: RegExpMatchArray,
  pattern: RegExp
): ParsedDate | null {
  // Pattern: DD/MM/YYYY or MM/DD/YYYY
  if (pattern.toString().includes('\\d{1,2})/(\\d{1,2})/(\\d{2,4}')) {
    let day = parseInt(match[1], 10);
    let month = parseInt(match[2], 10) - 1;
    let year = parseInt(match[3], 10);

    // Handle 2-digit years
    if (year < 100) {
      year += year > 50 ? 1900 : 2000;
    }

    // Determine if it's DD/MM or MM/DD based on values
    if (day > 12) {
      // Must be DD/MM format
      const temp = day;
      day = month + 1;
      month = temp - 1;
    } else if (month > 11) {
      // Invalid month, swap
      const temp = day;
      day = month + 1;
      month = temp - 1;
    }

    try {
      const date = new Date(year, month, day);
      return {
        date,
        confidence: 0.8,
        format: 'DD/MM/YYYY',
        originalString: match[0],
      };
    } catch {
      return null;
    }
  }

  // Pattern: MM/YYYY
  if (pattern.toString().includes('\\d{1,2})/(\\d{2,4})[^/]')) {
    const month = parseInt(match[1], 10) - 1;
    let year = parseInt(match[2], 10);

    if (year < 100) {
      year += year > 50 ? 1900 : 2000;
    }

    try {
      const date = new Date(year, month, 1);
      // Set to end of month
      date.setMonth(date.getMonth() + 1);
      date.setDate(0);

      return {
        date,
        confidence: 0.7,
        format: 'MM/YYYY',
        originalString: match[0],
      };
    } catch {
      return null;
    }
  }

  // Pattern: Month Year
  if (pattern.toString().includes('jan|feb|mar')) {
    const monthStr = match[1].toLowerCase();
    const month = monthNamesIndonesian[monthStr] ?? 0;
    let year = parseInt(match[2], 10);

    if (year < 100) {
      year += year > 50 ? 1900 : 2000;
    }

    try {
      const date = new Date(year, month, 1);
      date.setMonth(date.getMonth() + 1);
      date.setDate(0);

      return {
        date,
        confidence: 0.9,
        format: 'Month YYYY',
        originalString: match[0],
      };
    } catch {
      return null;
    }
  }

  return null;
}

export function isExpired(expiryDate: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return expiryDate < today;
}

export function daysUntilExpiry(expiryDate: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getExpiryStatus(expiryDate: Date): {
  isExpired: boolean;
  daysUntil: number;
  status: 'expired' | 'expiring_soon' | 'valid';
} {
  const isExp = isExpired(expiryDate);
  const days = daysUntilExpiry(expiryDate);

  let status: 'expired' | 'expiring_soon' | 'valid';
  if (isExp) {
    status = 'expired';
  } else if (days <= 30) {
    status = 'expiring_soon';
  } else {
    status = 'valid';
  }

  return {
    isExpired: isExp,
    daysUntil: days,
    status,
  };
}
