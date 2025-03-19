export interface Level {
  level: number;
  title: string;
  description: string;
}

export interface Category {
  name: string;
  description: string;
  levelDescriptions: string[];
}

export interface UserData {
  fullName: string;
  company: string;
  email: string;
  position: string;
}

export interface AssessmentResult {
  category: string;
  selectedLevel: number;
}

export interface Assessment {
  userData: UserData;
  results: AssessmentResult[];
} 