import { IgotService, IgotLearnerProfile, IgotCompetency, IgotCourse, IgotAssessmentResult, IgotDashboardStats, IgotSyncLog } from './igotTypes';
import { igotConfig } from './igotConfig';

export class IgotClient implements IgotService {
  private getHeaders() {
    return {
      'Authorization': `Bearer ${igotConfig.apiKey}`,
      'Content-Type': 'application/json',
      'X-Client-Id': igotConfig.clientId || ''
    };
  }

  async getLearnerProfile(userId: string): Promise<IgotLearnerProfile> {
    if (!igotConfig.validateConfig()) throw new Error('iGOT integration is not configured. Please add authorized API credentials.');
    
    const res = await fetch(`${igotConfig.apiBaseUrl}/users/${userId}/profile`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch iGOT profile');
    return res.json();
  }

  async getCompetencies(userId: string): Promise<IgotCompetency[]> {
    if (!igotConfig.validateConfig()) throw new Error('iGOT integration is not configured. Please add authorized API credentials.');
    
    const res = await fetch(`${igotConfig.apiBaseUrl}/users/${userId}/competencies`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch competencies');
    return res.json();
  }

  async getTrainingCatalogue(): Promise<IgotCourse[]> {
    if (!igotConfig.validateConfig()) throw new Error('iGOT integration is not configured. Please add authorized API credentials.');
    
    const res = await fetch(`${igotConfig.apiBaseUrl}/courses/catalogue`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch catalogue');
    return res.json();
  }

  async getTrainingDetails(trainingId: string): Promise<IgotCourse> {
    if (!igotConfig.validateConfig()) throw new Error('iGOT integration is not configured. Please add authorized API credentials.');
    
    const res = await fetch(`${igotConfig.apiBaseUrl}/courses/${trainingId}`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch training details');
    return res.json();
  }

  async getLearningProgress(userId: string): Promise<{ courseId: string; progress: number; status: string }[]> {
    if (!igotConfig.validateConfig()) throw new Error('iGOT integration is not configured. Please add authorized API credentials.');
    
    const res = await fetch(`${igotConfig.apiBaseUrl}/users/${userId}/progress`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch learning progress');
    return res.json();
  }

  async getAssessmentResults(userId: string): Promise<IgotAssessmentResult[]> {
    if (!igotConfig.validateConfig()) throw new Error('iGOT integration is not configured. Please add authorized API credentials.');
    
    const res = await fetch(`${igotConfig.apiBaseUrl}/users/${userId}/assessments`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch assessment results');
    return res.json();
  }

  async getCertificates(userId: string): Promise<any[]> {
    if (!igotConfig.validateConfig()) throw new Error('iGOT integration is not configured. Please add authorized API credentials.');
    
    const res = await fetch(`${igotConfig.apiBaseUrl}/users/${userId}/certificates`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch certificates');
    return res.json();
  }

  async getRecommendedTraining(userId: string, gapCompetency: string): Promise<IgotCourse[]> {
    if (!igotConfig.validateConfig()) throw new Error('iGOT integration is not configured. Please add authorized API credentials.');
    
    const res = await fetch(`${igotConfig.apiBaseUrl}/courses/recommend?competency=${encodeURIComponent(gapCompetency)}`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
  }

  async syncCompetency(userId: string, competency: any): Promise<boolean> {
    if (!igotConfig.validateConfig()) throw new Error('iGOT integration is not configured. Please add authorized API credentials.');
    
    const res = await fetch(`${igotConfig.apiBaseUrl}/users/${userId}/competencies/sync`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(competency)
    });
    return res.ok;
  }

  async syncTrainingProgress(userId: string, training: any): Promise<boolean> {
    if (!igotConfig.validateConfig()) throw new Error('iGOT integration is not configured. Please add authorized API credentials.');
    
    const res = await fetch(`${igotConfig.apiBaseUrl}/users/${userId}/progress/sync`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(training)
    });
    return res.ok;
  }

  async syncAssessmentResult(userId: string, result: IgotAssessmentResult): Promise<boolean> {
    if (!igotConfig.validateConfig()) throw new Error('iGOT integration is not configured. Please add authorized API credentials.');
    
    const res = await fetch(`${igotConfig.apiBaseUrl}/users/${userId}/assessments/sync`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(result)
    });
    return res.ok;
  }

  async getSyncDashboard(): Promise<IgotDashboardStats> {
    if (!igotConfig.validateConfig()) {
      return {
        status: 'Not Connected',
        lastSync: '-',
        learnersSyncCount: 0,
        coursesSyncCount: 0,
        competenciesSyncCount: 0,
        assessmentsSyncCount: 0,
        failedAttempts: 0
      };
    }
    
    const res = await fetch(`${igotConfig.apiBaseUrl}/admin/sync/dashboard`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  }

  async getSyncLogs(): Promise<IgotSyncLog[]> {
    if (!igotConfig.validateConfig()) throw new Error('iGOT integration is not configured. Please add authorized API credentials.');
    
    const res = await fetch(`${igotConfig.apiBaseUrl}/admin/sync/logs`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch sync logs');
    return res.json();
  }
}
