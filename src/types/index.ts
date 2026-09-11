export interface Drug {
  id: string;
  name: string;
  activeIngredients: {
    name: string;
    dosage: string;
  }[];
  category: string;
  manufacturer: string;
  form: string;
}

export interface IngredientInfo {
  maxDailyDose: string;
  warnings: string[];
  contraindications: string[];
  sideEffects: string[];
}

export interface UserProfile {
  conditions: string[];
  allergies: string[];
  age?: number;
  isPregnant?: boolean;
  isBreastfeeding?: boolean;
}

export interface ScanResult {
  identifiedDrug: Drug | null;
  confidence: number;
  expiryDate: Date | null;
  isExpired: boolean;
  daysUntilExpiry: number | null;
  duplicateIngredients: string[];
  profileWarnings: string[];
  ingredientWarnings: string[];
  safetyScore: number;
}

export interface ModelPrediction {
  className: string;
  probability: number;
}

export interface ModelMetadata {
  classes: string[];
  inputShape: number[];
  modelType: string;
}
