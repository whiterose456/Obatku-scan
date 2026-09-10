import interactionsData from '@/data/interactions.json';
import { getActiveIngredients } from './drug-database';
import type { IngredientInfo } from '@/types';

const ingredientDatabase: Record<string, IngredientInfo> =
  interactionsData as Record<string, IngredientInfo>;

export function getIngredientInfo(ingredientName: string): IngredientInfo | null {
  const normalized = ingredientName.toLowerCase();
  return ingredientDatabase[normalized] || null;
}

export interface DuplicateIngredientResult {
  ingredientName: string;
  drugIds: string[];
  totalDosage: string;
  warning: string;
}

export function checkDuplicateIngredients(
  drugIds: string[]
): DuplicateIngredientResult[] {
  // Collect all ingredients from all drugs
  const ingredientMap: Record<string, { drugIds: string[]; dosages: string[] }> =
    {};

  for (const drugId of drugIds) {
    const ingredients = getActiveIngredients(drugId);
    for (const ingredient of ingredients) {
      if (!ingredientMap[ingredient]) {
        ingredientMap[ingredient] = { drugIds: [], dosages: [] };
      }
      ingredientMap[ingredient].drugIds.push(drugId);
      // Note: In a real implementation, you'd parse and sum dosages properly
      ingredientMap[ingredient].dosages.push('varies');
    }
  }

  // Find duplicates (ingredients present in multiple drugs)
  const duplicates: DuplicateIngredientResult[] = [];

  for (const [ingredientName, data] of Object.entries(ingredientMap)) {
    if (data.drugIds.length > 1) {
      const info = getIngredientInfo(ingredientName);
      duplicates.push({
        ingredientName,
        drugIds: data.drugIds,
        totalDosage: 'Requires manual calculation',
        warning: info?.warnings[0]
          ? `Multiple sources of ${ingredientName}. ${info.warnings[0]}`
          : `Taking multiple medicines containing ${ingredientName} may lead to overdose.`,
      });
    }
  }

  return duplicates;
}

export function checkIngredientWarnings(
  drugIds: string[],
  userConditions: string[]
): string[] {
  const warnings: string[] = [];

  for (const drugId of drugIds) {
    const ingredients = getActiveIngredients(drugId);

    for (const ingredient of ingredients) {
      const info = getIngredientInfo(ingredient);
      if (!info) continue;

      // Check if any user conditions match warnings
      for (const condition of userConditions) {
        const normalizedCondition = condition.toLowerCase();

        if (
          info.warnings.some((w) => w.toLowerCase().includes(normalizedCondition))
        ) {
          warnings.push(
            `${ingredient} may not be suitable for people with ${condition}`
          );
        }

        if (
          info.contraindications.some((c) =>
            c.toLowerCase().includes(normalizedCondition)
          )
        ) {
          warnings.push(
            `${ingredient} is contraindicated for people with ${condition}. Consult a doctor.`
          );
        }
      }
    }
  }

  return warnings;
}
