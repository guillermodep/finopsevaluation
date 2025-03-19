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
  
  // Nuevos campos para la información de infraestructura y equipos
  cloudProviders: {
    aws: boolean;
    azure: boolean;
    gcp: boolean;
    oracle: boolean;
    ibm: boolean;
    other: boolean;
    otherSpecified: string;
  };
  
  teamComposition: number; // 1-5 o 6 para 'Otro'
  teamCompositionOther: string;
  
  annualBudget: number; // 1-5
  
  monthlySpend: number; // 1-5
}

export interface AssessmentResult {
  category: string;
  selectedLevel: number;
}

export interface Assessment {
  userData: UserData;
  results: AssessmentResult[];
} 