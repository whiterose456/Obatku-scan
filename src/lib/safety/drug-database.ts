import drugsData from '@/data/drugs.json';
import type { Drug } from '@/types';

const drugDatabase: Record<string, Drug> = drugsData as Record<string, Drug>;

export function getDrugById(id: string): Drug | null {
  return drugDatabase[id] || null;
}

export function getDrugByName(name: string): Drug | null {
  const normalizedName = name.toLowerCase().replace(/\s+/g, '_');
  return drugDatabase[normalizedName] || null;
}

export function searchDrugsByIngredient(ingredientName: string): Drug[] {
  const normalized = ingredientName.toLowerCase();
  return Object.values(drugDatabase).filter((drug) =>
    drug.activeIngredients.some(
      (ing) => ing.name.toLowerCase() === normalized
    )
  );
}

export function getAllDrugs(): Drug[] {
  return Object.values(drugDatabase);
}

export function getActiveIngredients(drugId: string): string[] {
  const drug = getDrugById(drugId);
  if (!drug) return [];
  return drug.activeIngredients.map((ing) => ing.name);
}
