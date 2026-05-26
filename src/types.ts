export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  subscriptionPlan?: string;
  createdAt: string;
  isDemo?: boolean;
  badge?: string;
  bio?: string;
  role?: string;
  age?: number;
  mobile?: string;
}

export interface SetupStatus {
  isSupabaseConfigured: boolean;
  usingLocalDb: boolean;
}

export interface ResumeReport {
  id: string;
  userId: string;
  filename: string;
  atsScore: number;
  keywordsMissing: string[];
  suggestedImprovements: string[];
  overallSummary: string;
  formattedText?: string;
  createdAt: string;
}

export interface LinkedInGeneration {
  id: string;
  userId: string;
  currentRole: string;
  targetRole: string;
  experienceLevel: string;
  skills: string;
  achievements: string;
  headline: string;
  aboutSection: string;
  skillsSection: string;
  createdAt: string;
}

export interface ProjectGeneration {
  id: string;
  userId: string;
  domain: string;
  experienceLevel?: string;
  title: string;
  description: string;
  features: string[];
  techStack: string[];
  databaseDesign: string;
  roadmap: string[];
  resumeSummary: string;
  createdAt: string;
}

export interface CoverLetter {
  id: string;
  userId: string;
  jobTitle: string;
  companyName: string;
  letterContent: string;
  createdAt: string;
}

export interface SkillGapReport {
  id: string;
  userId: string;
  targetRole: string;
  currentSkills: string[];
  targetSkills: string[];
  missingSkills: string[];
  learningRecommendations: {
    skill: string;
    resources: string[];
    certificationSuggested?: string;
  }[];
  createdAt: string;
}

export interface CareerRoadmap {
  id: string;
  userId: string;
  currentLevel: string;
  targetRole: string;
  timelineWeeks: number;
  steps: {
    weekRange: string;
    title: string;
    description: string;
    skillsToAcquire: string[];
    actionItems: string[];
    deliverable: string;
  }[];
  createdAt: string;
}

export interface InterviewQuestion {
  question: string;
  type: 'technical' | 'hr' | 'system_design';
  modelAnswer: string;
  userAnswer?: string;
  feedback?: string;
}

export interface InterviewPrep {
  id: string;
  userId: string;
  targetRole: string;
  experienceLevel: string;
  questions: InterviewQuestion[];
  createdAt: string;
}

export interface BulletPoint {
  id: string;
  userId: string;
  inputActivity: string;
  bullets: string[];
  createdAt: string;
}

export interface SavedGenerations {
  resumes: ResumeReport[];
  linkedin: LinkedInGeneration[];
  projects: ProjectGeneration[];
  coverLetters: CoverLetter[];
  skillGaps: SkillGapReport[];
  careerRoadmaps: CareerRoadmap[];
  interviews: InterviewPrep[];
  bullets: BulletPoint[];
}

export interface UsageAnalytics {
  totalGenerations: number;
  tokensUsedEst: number;
  creditsRemaining: number;
  breakdown: {
    resumes: number;
    linkedin: number;
    projects: number;
    coverLetters: number;
    skillGaps: number;
    roadmaps: number;
    interviews: number;
    bullets: number;
  };
}
