import type { Drug, ScanResult } from '@/types';
import { getDrugById, getActiveIngredients } from './drug-database';
import { checkDuplicateIngredients, checkIngredientWarnings } from './interaction-checker';
import { getUserConditions } from './user-profile';
import { getExpiryStatus } from '@/lib/ocr/date-parser';

export interface SafetyReport {
  result: ScanResult;
  recommendations: string[];
  overallSafety: 'safe' | 'caution' | 'unsafe';
}

export function generateSafetyReport(
  identifiedDrugId: string,
  confidence: number,
  expiryDate: Date | null
): SafetyReport {
  const drug = getDrugById(identifiedDrugId);
  const recommendations: string[] = [];
  let overallSafety: 'safe' | 'caution' | 'unsafe' = 'safe';
  let safetyScore = 100;

  // Check expiry status
  let isExpired = false;
  let daysUntilExpiry: number | null = null;

  if (expiryDate) {
    const status = getExpiryStatus(expiryDate);
    isExpired = status.isExpired;
    daysUntilExpiry = status.daysUntil;

    if (isExpired) {
      recommendations.push('⚠️ This medicine has EXPIRED. Do not use it.');
      overallSafety = 'unsafe' as const;
      safetyScore -= 50;
    } else if (daysUntilExpiry !== null && daysUntilExpiry <= 30) {
      recommendations.push(
        `⚠️ This medicine expires in ${daysUntilExpiry} days. Consider replacing it soon.`
      );
      overallSafety = 'caution' as const;
      safetyScore -= 20;
    }
  }

  // Check for duplicate ingredients (assuming single drug scan for now)
  const drugIds = [identifiedDrugId];
  const duplicates = checkDuplicateIngredients(drugIds);

  if (duplicates.length > 0) {
    for (const dup of duplicates) {
      recommendations.push(`⚠️ ${dup.warning}`);
    }
    overallSafety = overallSafety === 'unsafe' ? 'unsafe' : 'caution';
    safetyScore -= 15;
  }

  // Check user profile-based warnings
  const userConditions = getUserConditions();
  const profileWarnings = checkIngredientWarnings(drugIds, userConditions);

  if (profileWarnings.length > 0) {
    for (const warning of profileWarnings) {
      recommendations.push(`⚠️ ${warning}`);
      overallSafety = overallSafety === 'unsafe' ? 'unsafe' : 'caution';
      safetyScore -= 20;
    }
  }

  // Add general recommendations based on drug category
  if (drug) {
    if (drug.category === 'antibiotic') {
      recommendations.push('ℹ️ Complete the full course of antibiotics as prescribed.');
    }
    if (drug.category === 'analgesic' || drug.category === 'nsaid') {
      recommendations.push('ℹ️ Do not exceed the recommended dosage.');
    }
  }

  // If no specific warnings, add positive message
  if (recommendations.length === 0) {
    recommendations.push('✅ No safety issues detected. Use as directed.');
  }

  // Ensure safety score is within bounds
  safetyScore = Math.max(0, Math.min(100, safetyScore));

  const result: ScanResult = {
    identifiedDrug: drug,
    confidence,
    expiryDate,
    isExpired,
    daysUntilExpiry,
    duplicateIngredients: duplicates.map((d) => d.ingredientName),
    profileWarnings,
    ingredientWarnings: duplicates.map((d) => d.warning),
    safetyScore,
  };

  return {
    result,
    recommendations,
    overallSafety,
  };
}

export function calculateSafetyScore(
  isExpired: boolean,
  daysUntilExpiry: number | null,
  duplicateCount: number,
  warningCount: number
): number {
  let score = 100;

  if (isExpired) {
    score -= 50;
  } else if (daysUntilExpiry !== null && daysUntilExpiry <= 30) {
    score -= 20;
  }

  score -= duplicateCount * 15;
  score -= warningCount * 20;

  return Math.max(0, Math.min(100, score));
}
