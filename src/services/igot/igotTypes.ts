export interface IgotLearnerProfile {
  id: string;
  name: string;
  officialId: string;
  department: string;
  role: string;
  designation: string;
  competencies: IgotCompetency[];
  completedCourses: IgotCourse[];
  learningProgress: number;
}

export interface IgotCompetency {
  id: string;
  name: string;
  level: string;
  status: 'Mastered' | 'Developing' | 'Beginner';
}


export interface IgotCourse {
  id: string;
  igotCourseId: string;
  title: string;
  description: string;
  provider: string;
  providerId: string;
  category: string;
  topic: string;
  competencies: string[];
  language: string[];
  duration: string;
  difficulty: string;
  courseType: string;
  certificateAvailable: boolean;
  isFree: boolean;
  thumbnail: string;
  courseUrl: string;
  source: string;
  lastSyncedAt: string;
  status: 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'RESTRICTED' | 'UNAVAILABLE';
  isRecommended: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IgotLearnerCourse extends IgotCourse {
  learnerProgress: number; // 0 to 100
  learnerStatus: 'Not Started' | 'In Progress' | 'Completed';
  lastAccessed: string;
}


export interface IgotAssessmentResult {
  assessmentId: string;
  courseId: string;
  result: 'Pass' | 'Fail';
  score: number;
  timestamp: string;
  competencies: string[];
}

export interface IgotSyncLog {
  id: string;
  timestamp: string;
  operation: string;
  user: string;
  resource: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  response?: string;
  error?: string;
}

export interface IgotDashboardStats {
  status: 'Connected' | 'Demo / Simulation Mode' | 'Not Connected';
  lastSync: string;
  learnersSyncCount: number;
  coursesSyncCount: number;
  competenciesSyncCount: number;
  assessmentsSyncCount: number;
  failedAttempts: number;
}

export interface IgotService {
  getLearnerProfile(userId: string): Promise<IgotLearnerProfile>;
  getCompetencies(userId: string): Promise<IgotCompetency[]>;
  getTrainingCatalogue(): Promise<IgotCourse[]>;
  getTrainingDetails(trainingId: string): Promise<IgotCourse>;
  getLearningProgress(userId: string): Promise<{ courseId: string; progress: number; status: string }[]>;
  getAssessmentResults(userId: string): Promise<IgotAssessmentResult[]>;
  getCertificates(userId: string): Promise<any[]>;
  getRecommendedTraining(userId: string, gapCompetency: string): Promise<IgotCourse[]>;
  
  syncCompetency(userId: string, competency: any): Promise<boolean>;
  syncTrainingProgress(userId: string, training: any): Promise<boolean>;
  syncAssessmentResult(userId: string, result: IgotAssessmentResult): Promise<boolean>;
  
  getSyncDashboard(): Promise<IgotDashboardStats>;
  getSyncLogs(): Promise<IgotSyncLog[]>;
}
