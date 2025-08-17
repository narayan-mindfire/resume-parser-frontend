export interface Resume {
  id: string;
  fileName: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  totalExperienceYears: number | null;
  processingStatus: "processing" | "completed" | "failed";
  skills: string[];
  experience: string[];
  education: string[];
  url: string | null;
}

export interface Batch {
  id: string;
  userId: string;
  createdAt: string;
}

export interface Insights {
  topSkills: { skill: string; count: number }[];
  averageExperience: number;
  commonUniversities: { university: string; count: number }[];
}

export interface JobType {
  id: string;
  title: string;
  description: string;
  skills: string[];
  required_experience_years: number;
}
