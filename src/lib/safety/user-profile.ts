import type { UserProfile } from '@/types';

const STORAGE_KEY = 'obathu_user_profile';

export function getDefaultProfile(): UserProfile {
  return {
    conditions: [],
    allergies: [],
    age: undefined,
    isPregnant: false,
    isBreastfeeding: false,
  };
}

export function loadUserProfile(): UserProfile {
  if (typeof window === 'undefined') {
    return getDefaultProfile();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as UserProfile;
    }
  } catch (error) {
    console.error('Error loading user profile:', error);
  }

  return getDefaultProfile();
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
}

export function updateUserProfile(
  updates: Partial<UserProfile>
): UserProfile {
  const current = loadUserProfile();
  const updated = { ...current, ...updates };
  saveUserProfile(updated);
  return updated;
}

export function addCondition(condition: string): UserProfile {
  const profile = loadUserProfile();
  if (!profile.conditions.includes(condition)) {
    profile.conditions.push(condition);
    saveUserProfile(profile);
  }
  return profile;
}

export function removeCondition(condition: string): UserProfile {
  const profile = loadUserProfile();
  profile.conditions = profile.conditions.filter((c) => c !== condition);
  saveUserProfile(profile);
  return profile;
}

export function addAllergy(allergy: string): UserProfile {
  const profile = loadUserProfile();
  if (!profile.allergies.includes(allergy)) {
    profile.allergies.push(allergy);
    saveUserProfile(profile);
  }
  return profile;
}

export function removeAllergy(allergy: string): UserProfile {
  const profile = loadUserProfile();
  profile.allergies = profile.allergies.filter((a) => a !== allergy);
  saveUserProfile(profile);
  return profile;
}

export function getUserConditions(): string[] {
  const profile = loadUserProfile();
  const conditions = [...profile.conditions];

  // Add implicit conditions based on profile flags
  if (profile.isPregnant) {
    conditions.push('pregnancy');
  }
  if (profile.isBreastfeeding) {
    conditions.push('breastfeeding');
  }

  return conditions;
}
