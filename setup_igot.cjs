const fs = require('fs');
const path = require('path');

// --- 1. Update Types ---
const typesPath = 'src/services/igot/igotTypes.ts';
let typesContent = fs.readFileSync(typesPath, 'utf8');

const newCourseInterface = `
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
`;

// Replace the old IgotCourse interface
typesContent = typesContent.replace(/export interface IgotCourse \{[\s\S]*?\n\}/, newCourseInterface);
fs.writeFileSync(typesPath, typesContent);

// --- 2. Update Mock Service Data ---
const mockServicePath = 'src/services/igot/igotMockService.ts';
let mockServiceContent = fs.readFileSync(mockServicePath, 'utf8');

// The new seed data
const newMockCourses = `
const MOCK_COURSES: import('./igotTypes').IgotCourse[] = [
  {
    id: 'course-1', igotCourseId: 'do_1', title: 'Data Driven Decision Making For Government', description: 'Learn how to use data to drive decisions in public administration.', provider: 'Capacity Building Commission', providerId: 'cbc-1', category: 'Data Science', topic: 'Data & Technology', competencies: ['Data-Driven Decision Making', 'Data Analysis'], language: ['English'], duration: '2h 30m', difficulty: 'Intermediate', courseType: 'Online', certificateAvailable: true, isFree: true, thumbnail: '', courseUrl: 'https://igotkarmayogi.gov.in/explore/course/do_1', source: 'iGOT Karmayogi', lastSyncedAt: new Date().toISOString(), status: 'AVAILABLE', isRecommended: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: 'course-2', igotCourseId: 'do_2', title: 'Fundamentals of Public Policy', description: 'Core principles of policy making and analysis.', provider: 'Indian School of Public Policy', providerId: 'ispp-1', category: 'Public Policy', topic: 'Governance', competencies: ['Policy Analysis', 'Governance'], language: ['English'], duration: '2h 55m', difficulty: 'Beginner', courseType: 'Online', certificateAvailable: true, isFree: true, thumbnail: '', courseUrl: 'https://igotkarmayogi.gov.in/explore/course/do_2', source: 'iGOT Karmayogi', lastSyncedAt: new Date().toISOString(), status: 'AVAILABLE', isRecommended: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: 'course-3', igotCourseId: 'do_3', title: 'AI Using Google Bard and ChatGPT for Beginners', description: 'Introduction to generative AI tools for productivity.', provider: 'Invest India', providerId: 'ii-1', category: 'Technology', topic: 'Data & Technology', competencies: ['Artificial Intelligence', 'Digital Literacy'], language: ['English'], duration: '25m', difficulty: 'Beginner', courseType: 'Online', certificateAvailable: true, isFree: true, thumbnail: '', courseUrl: 'https://igotkarmayogi.gov.in/explore/course/do_3', source: 'iGOT Karmayogi', lastSyncedAt: new Date().toISOString(), status: 'AVAILABLE', isRecommended: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: 'course-4', igotCourseId: 'do_4', title: 'Microsoft Excel for Beginners', description: 'Foundational spreadsheet skills.', provider: 'Microsoft', providerId: 'ms-1', category: 'Productivity', topic: 'Digital Skills', competencies: ['Spreadsheet Fundamentals', 'Data Management', 'Data Analysis'], language: ['English'], duration: '7h 4m', difficulty: 'Beginner', courseType: 'Online', certificateAvailable: true, isFree: true, thumbnail: '', courseUrl: 'https://igotkarmayogi.gov.in/explore/course/do_4', source: 'iGOT Karmayogi', lastSyncedAt: new Date().toISOString(), status: 'AVAILABLE', isRecommended: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: 'course-5', igotCourseId: 'do_5', title: 'Basics of Administrative Law', description: 'Introduction to legal frameworks in administration.', provider: 'LBSNAA', providerId: 'lbsnaa-1', category: 'Law', topic: 'Law', competencies: ['Administrative Law', 'Legal Compliance'], language: ['English'], duration: '44m', difficulty: 'Intermediate', courseType: 'Online', certificateAvailable: true, isFree: true, thumbnail: '', courseUrl: 'https://igotkarmayogi.gov.in/explore/course/do_5', source: 'iGOT Karmayogi', lastSyncedAt: new Date().toISOString(), status: 'AVAILABLE', isRecommended: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: 'course-6', igotCourseId: 'do_6', title: 'Digital Safety Essentials', description: 'Cybersecurity basics for government officials.', provider: 'Microsoft', providerId: 'ms-1', category: 'Security', topic: 'Data & Technology', competencies: ['Cybersecurity', 'Information Security'], language: ['English', 'Hindi'], duration: '1h 15m', difficulty: 'Beginner', courseType: 'Online', certificateAvailable: true, isFree: true, thumbnail: '', courseUrl: 'https://igotkarmayogi.gov.in/explore/course/do_6', source: 'iGOT Karmayogi', lastSyncedAt: new Date().toISOString(), status: 'AVAILABLE', isRecommended: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: 'course-7', igotCourseId: 'do_7', title: 'Introduction: Basics of Project Management', description: 'Learn how to plan and execute projects effectively.', provider: 'Quality Council of India', providerId: 'qci-1', category: 'Management', topic: 'Project Management', competencies: ['Project Planning', 'Execution'], language: ['English'], duration: '1h 30m', difficulty: 'Beginner', courseType: 'Online', certificateAvailable: true, isFree: true, thumbnail: '', courseUrl: 'https://igotkarmayogi.gov.in/explore/course/do_7', source: 'iGOT Karmayogi', lastSyncedAt: new Date().toISOString(), status: 'AVAILABLE', isRecommended: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: 'course-8', igotCourseId: 'do_8', title: 'Six Sigma Fundamentals', description: 'Introduction to process improvement methodologies.', provider: 'Genpact', providerId: 'gp-1', category: 'Management', topic: 'Project Management', competencies: ['Process Improvement', 'Quality Assurance'], language: ['English'], duration: '4h 5m', difficulty: 'Intermediate', courseType: 'Online', certificateAvailable: true, isFree: true, thumbnail: '', courseUrl: 'https://igotkarmayogi.gov.in/explore/course/do_8', source: 'iGOT Karmayogi', lastSyncedAt: new Date().toISOString(), status: 'AVAILABLE', isRecommended: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: 'course-9', igotCourseId: 'do_9', title: 'Design Thinking', description: 'Human-centered approach to problem solving.', provider: 'Capacity Building Commission', providerId: 'cbc-1', category: 'Innovation', topic: 'Behavioural Skills', competencies: ['Design Thinking', 'Problem Solving'], language: ['English'], duration: '1h 55m', difficulty: 'Beginner', courseType: 'Online', certificateAvailable: true, isFree: true, thumbnail: '', courseUrl: 'https://igotkarmayogi.gov.in/explore/course/do_9', source: 'iGOT Karmayogi', lastSyncedAt: new Date().toISOString(), status: 'AVAILABLE', isRecommended: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: 'course-10', igotCourseId: 'do_10', title: 'Prevention of Sexual Harassment of Women at Workplace', description: 'Understanding POSH guidelines and compliance.', provider: 'Institute of Secretariat Training and Management', providerId: 'istm-1', category: 'HR', topic: 'Human Resources', competencies: ['Workplace Ethics', 'POSH Compliance'], language: ['English', 'Hindi'], duration: '1h 52m', difficulty: 'Beginner', courseType: 'Online', certificateAvailable: true, isFree: true, thumbnail: '', courseUrl: 'https://igotkarmayogi.gov.in/explore/course/do_10', source: 'iGOT Karmayogi', lastSyncedAt: new Date().toISOString(), status: 'AVAILABLE', isRecommended: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: 'course-11', igotCourseId: 'do_11', title: 'Fire Safety in Healthcare Facilities', description: 'Protocols for fire safety in hospitals.', provider: 'Ministry of Health and Family Welfare', providerId: 'mohw-1', category: 'Safety', topic: 'Health', competencies: ['Fire Safety', 'Emergency Response'], language: ['English'], duration: '1h 23m', difficulty: 'Intermediate', courseType: 'Online', certificateAvailable: true, isFree: true, thumbnail: '', courseUrl: 'https://igotkarmayogi.gov.in/explore/course/do_11', source: 'iGOT Karmayogi', lastSyncedAt: new Date().toISOString(), status: 'AVAILABLE', isRecommended: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: 'course-12', igotCourseId: 'do_12', title: 'Civil Defence Services', description: 'Basics of civil defence operations and strategies.', provider: 'National Disaster Response Force', providerId: 'ndrf-1', category: 'Safety', topic: 'Governance', competencies: ['Disaster Management', 'Civil Defence'], language: ['English', 'Hindi'], duration: '1h 17m', difficulty: 'Beginner', courseType: 'Online', certificateAvailable: true, isFree: true, thumbnail: '', courseUrl: 'https://igotkarmayogi.gov.in/explore/course/do_12', source: 'iGOT Karmayogi', lastSyncedAt: new Date().toISOString(), status: 'AVAILABLE', isRecommended: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: 'course-13', igotCourseId: 'do_13', title: 'Introduction To Bharatiya Nyaya Sanhita, 2023', description: 'Overview of the new criminal code.', provider: 'Karmayogi Bharat', providerId: 'kb-1', category: 'Law', topic: 'Law', competencies: ['Criminal Law', 'Legal Frameworks'], language: ['English', 'Hindi'], duration: '53m', difficulty: 'Intermediate', courseType: 'Online', certificateAvailable: true, isFree: true, thumbnail: '', courseUrl: 'https://igotkarmayogi.gov.in/explore/course/do_13', source: 'iGOT Karmayogi', lastSyncedAt: new Date().toISOString(), status: 'AVAILABLE', isRecommended: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: 'course-14', igotCourseId: 'do_14', title: 'Introduction to Bharatiya Nagarik Suraksha Sanhita, 2023', description: 'Overview of the procedural code.', provider: 'Karmayogi Bharat', providerId: 'kb-1', category: 'Law', topic: 'Law', competencies: ['Criminal Procedure', 'Legal Frameworks'], language: ['English', 'Hindi'], duration: '1h 23m', difficulty: 'Intermediate', courseType: 'Online', certificateAvailable: true, isFree: true, thumbnail: '', courseUrl: 'https://igotkarmayogi.gov.in/explore/course/do_14', source: 'iGOT Karmayogi', lastSyncedAt: new Date().toISOString(), status: 'AVAILABLE', isRecommended: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: 'course-15', igotCourseId: 'do_15', title: 'Introduction to Bharatiya Sakshya Adhiniyam, 2023', description: 'Overview of the new evidence act.', provider: 'Karmayogi Bharat', providerId: 'kb-1', category: 'Law', topic: 'Law', competencies: ['Evidence Law', 'Legal Frameworks'], language: ['English', 'Hindi'], duration: '16m', difficulty: 'Intermediate', courseType: 'Online', certificateAvailable: true, isFree: true, thumbnail: '', courseUrl: 'https://igotkarmayogi.gov.in/explore/course/do_15', source: 'iGOT Karmayogi', lastSyncedAt: new Date().toISOString(), status: 'AVAILABLE', isRecommended: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: 'course-16', igotCourseId: 'do_16', title: 'Public Governance Models', description: 'Study of different models of governance in the public sector.', provider: 'ISB Hyderabad', providerId: 'isb-1', category: 'Governance', topic: 'Governance', competencies: ['Governance Models', 'Public Administration'], language: ['English'], duration: '59m', difficulty: 'Advanced', courseType: 'Online', certificateAvailable: true, isFree: true, thumbnail: '', courseUrl: 'https://igotkarmayogi.gov.in/explore/course/do_16', source: 'iGOT Karmayogi', lastSyncedAt: new Date().toISOString(), status: 'AVAILABLE', isRecommended: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  }
];
`;

mockServiceContent = mockServiceContent.replace(/const MOCK_COURSES: IgotCourse\[\] = \[[\s\S]*?\];/m, newMockCourses);
// Add search capability to getTrainingCatalogue
mockServiceContent = mockServiceContent.replace(
  `async getTrainingCatalogue(): Promise<IgotCourse[]> {
    return MOCK_COURSES;
  }`,
  `async getTrainingCatalogue(query?: string, filters?: any): Promise<IgotCourse[]> {
    let courses = [...MOCK_COURSES];
    if (query) {
      const lowerQ = query.toLowerCase();
      courses = courses.filter(c => 
        c.title.toLowerCase().includes(lowerQ) || 
        c.description.toLowerCase().includes(lowerQ) ||
        c.provider.toLowerCase().includes(lowerQ) ||
        c.topic.toLowerCase().includes(lowerQ) ||
        c.competencies.some(comp => comp.toLowerCase().includes(lowerQ))
      );
    }
    if (filters) {
      if (filters.topic) courses = courses.filter(c => c.topic === filters.topic);
      if (filters.provider) courses = courses.filter(c => c.provider === filters.provider);
      // add other filters as needed
    }
    return courses;
  }`
);

mockServiceContent = mockServiceContent.replace(/export class IgotMockService implements IgotService \{[\s\S]*?async getLearningProgress\(userId: string\)/,
  `export class IgotMockService implements IgotService {
  async getLearnerProfile(userId: string): Promise<IgotLearnerProfile> {
    return {
      id: userId,
      name: 'Aarav Sharma',
      officialId: 'GOV-IND-48291',
      department: 'Ministry of Statistics (MoSPI)',
      role: 'Statistical Officer',
      designation: 'Senior Analyst',
      competencies: await this.getCompetencies(userId),
      completedCourses: MOCK_COURSES.filter(c => c.status === 'COMPLETED'),
      learningProgress: 76
    };
  }

  async getCompetencies(userId: string): Promise<IgotCompetency[]> {
    return [
      { id: 'comp-1', name: 'Sampling Methods', level: 'Intermediate', status: 'Mastered' },
      { id: 'comp-2', name: 'Data Visualization', level: 'Advanced', status: 'Mastered' },
      { id: 'comp-3', name: 'Probability Fundamentals', level: 'Beginner', status: 'Developing' }
    ];
  }

  async getTrainingCatalogue(query?: string, filters?: any): Promise<import('./igotTypes').IgotCourse[]> {
    let courses = [...MOCK_COURSES];
    if (query) {
      const lowerQ = query.toLowerCase();
      courses = courses.filter(c => 
        c.title.toLowerCase().includes(lowerQ) || 
        c.description.toLowerCase().includes(lowerQ) ||
        c.provider.toLowerCase().includes(lowerQ) ||
        c.topic.toLowerCase().includes(lowerQ) ||
        c.competencies.some(comp => comp.toLowerCase().includes(lowerQ))
      );
    }
    if (filters) {
      if (filters.topic && filters.topic !== 'All') courses = courses.filter(c => c.topic === filters.topic);
      if (filters.provider && filters.provider !== 'All') courses = courses.filter(c => c.provider === filters.provider);
      if (filters.difficulty && filters.difficulty !== 'All') courses = courses.filter(c => c.difficulty === filters.difficulty);
    }
    return courses;
  }

  async getTrainingDetails(trainingId: string): Promise<import('./igotTypes').IgotCourse> {
    const course = MOCK_COURSES.find(c => c.id === trainingId);
    if (!course) throw new Error('Course not found in iGOT');
    return course;
  }

  async getLearningProgress(userId: string)`
);

mockServiceContent = mockServiceContent.replace(/return MOCK_COURSES\.map\(c => \(\{\n\s*courseId: c\.id,\n\s*progress: c\.progress,\n\s*status: c\.status\n\s*\}\)\);/, 
  `return MOCK_COURSES.slice(0, 3).map((c, i) => ({
      courseId: c.id,
      progress: i === 0 ? 100 : i === 1 ? 45 : 0,
      status: i === 0 ? 'Completed' : i === 1 ? 'In Progress' : 'Not Started'
    }));`
);

fs.writeFileSync(mockServicePath, mockServiceContent);
console.log('Types and Mock Service updated');
