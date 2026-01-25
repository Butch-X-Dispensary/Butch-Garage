
export interface Vehicle {
  id: string;
  name: string;
  year: number;
  luxuryLevel: 'Executive' | 'Elite' | 'Sovereign' | 'Humanitarian';
  crewQuarters?: number;
  type: 'Chain Jet' | 'Supercar' | 'Heavy Duty' | 'Hovercraft' | 'Corporate' | 'Humanitarian' | 'Mag-Lev' | 'Cyber-Bike' | 'Hovercar' | 'Submersible' | 'Space Freighter' | 'Timepiece' | 'Helicopter';
  origin: string;
  description: string;
  image: string;
  marketStatus?: 'Available' | 'Vaulted' | 'Auctioning' | 'Pre-Order';
  price?: string;
  specs: {
    speed: string;
    engine: string;
    tech: string[];
  };
}

export interface GlobalPattern {
  patternId: string;
  originHub: string;
  destinationHub: string;
  connectionType: string;
  logisticsRoute: string;
  energyRequirement: string;
  culturalSyncProtocol: string;
  status: 'OPTIMIZED' | 'SYNCHRONIZING' | 'OFFLINE';
  nodes: {
    name: string;
    coordinate: string;
    strength: number;
  }[];
}

export interface SocialCampaign {
  campaignName: string;
  xThread: string[];
  instaCaption: string;
  linkedInPost: string;
  tiktokScript: string;
  holographicHashtags: string[];
  reachProjection: string;
}

export interface PerformancePatch {
  patchId: string;
  objectiveName: string;
  optimizationSummary: string;
  engineTuning: string;
  aiLogicUpgrade: string;
  resonanceBonus: string;
  stabilityRating: string;
}

export interface CommunityProject {
  id: string;
  name: string;
  location: string;
  challenge: string;
  techSolution: string;
  impactScore: number;
  status: 'In-Dev' | 'Active' | 'Complete';
}

export interface ProjectProposal {
  title: string;
  concept: string;
  techStack: string[];
  socialROI: string;
  implementationStages: string[];
}

export interface FinancialSynergy {
  sectorName: string;
  financialGoal: string;
  allocatedBudget: string;
  fundingStrategy: string;
  assetSynergy: string;
  povertyReductionIndex: string;
  nextSteps: string[];
}

export interface WarpLogistics {
  destination: string;
  distance: string;
  warpFactor: string;
  arrivalEstimate: string;
  energyCore: string;
  safetyProtocols: string[];
  logisticsNote: string;
}

export interface BlueprintScript {
  title: string;
  technicalDetails: string;
  materials: string[];
  stages: {
    name: string;
    description: string;
  }[];
  aiRecommendation: string;
}

export interface ImpactStat {
  label: string;
  value: string;
  numericValue: number;
  sublabel: string;
}
