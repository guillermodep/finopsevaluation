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

  // Campos para preguntas adicionales - asegúrate de que estén como parte de la interfaz principal
  workloadTypes: {
    iaas: boolean;
    paas: boolean;
    saas: boolean;
    faas: boolean;
    dbaas: boolean;
  };

  serversCount: number; // 1-5

  marketplacePurchases: number; // 1-5

  paymentModels: {
    onDemand: boolean;
    reserved: boolean;
    longTermContracts: boolean;
    byol: boolean;
    freeTier: boolean;
  };

  finOpsTools: {
    nativeTools: boolean;
    thirdPartyTools: boolean;
    internalTools: boolean;
    noTools: boolean;
    other: boolean;
    otherSpecified: string;
  };

  costReductionPractices: {
    rightsizing: boolean;
    storageReconfiguration: boolean;
    scheduledShutdown: boolean;
    reservedInstances: boolean;
    licenseOptimization: boolean;
  };
}

export interface AssessmentResult {
  category: string;
  selectedLevel: number;
}

export interface Assessment {
  userData: UserData;
  results: AssessmentResult[];
} 