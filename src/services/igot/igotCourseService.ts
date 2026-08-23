import { IgotCourse } from './igotTypes';
import { IgotMockService } from './igotMockService';

// Fallback to mock service for demo mode, which handles our logic.
// In a real app, this would use the authorized client to ping iGOT APIs.
const mockService = new IgotMockService();

export class IgotCourseService {
  async getCourses(): Promise<IgotCourse[]> {
    return mockService.getTrainingCatalogue();
  }

  async getCourse(courseId: string): Promise<IgotCourse> {
    return mockService.getTrainingDetails(courseId);
  }

  async searchCourses(query: string, filters?: any): Promise<IgotCourse[]> {
    // Explicitly returning the mock logic that handles title, description, and provider
    return mockService.getTrainingCatalogue(query, filters);
  }

  async getCoursesByTopic(topic: string): Promise<IgotCourse[]> {
    return mockService.getTrainingCatalogue('', { topic });
  }

  async getCoursesByCompetency(competency: string): Promise<IgotCourse[]> {
    // We pass it to query so the mock checks competencies too
    return mockService.getTrainingCatalogue(competency);
  }

  async getCoursesByProvider(provider: string): Promise<IgotCourse[]> {
    return mockService.getTrainingCatalogue('', { provider });
  }

  async getCourseCategories(): Promise<string[]> {
    const courses = await this.getCourses();
    return Array.from(new Set(courses.map(c => c.category)));
  }

  async getCourseProviders(): Promise<string[]> {
    const courses = await this.getCourses();
    return Array.from(new Set(courses.map(c => c.provider)));
  }

  async getCourseCompetencies(): Promise<string[]> {
    const courses = await this.getCourses();
    const competencies = new Set<string>();
    courses.forEach(c => c.competencies.forEach(comp => competencies.add(comp)));
    return Array.from(competencies);
  }

  async syncCourseCatalogue(): Promise<boolean> {
    // Placeholder for actual sync logic
    return true;
  }
}

export const igotCourseService = new IgotCourseService();
