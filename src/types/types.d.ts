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
