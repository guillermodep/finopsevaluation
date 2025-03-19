import { Assessment, UserData, AssessmentResult } from '@/types/assessment';

const STORAGE_KEY = 'finops_assessment';

export const getStoredAssessment = (): Assessment | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const storeUserData = (userData: UserData) => {
  const current = getStoredAssessment() || { userData: null, results: [] as AssessmentResult[] };
  const updated = { ...current, userData };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const storeResult = (result: AssessmentResult) => {
  const current = getStoredAssessment() || { userData: null, results: [] as AssessmentResult[] };
  const resultIndex = current.results.findIndex(r => r.category === result.category);
  
  if (resultIndex >= 0) {
    current.results[resultIndex] = result;
  } else {
    current.results.push(result);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
};

export const clearAssessment = () => {
  localStorage.removeItem(STORAGE_KEY);
}; 