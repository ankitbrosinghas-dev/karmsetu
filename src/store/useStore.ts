import { create } from 'zustand';
import { User, Competency, DEMO_USER, DEMO_COMPETENCIES, calculateStatus } from './mockData';
import { generateCompetencyProfile, OfficialProfileInput } from './profileGenerator';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, getDocs, query, where, writeBatch } from 'firebase/firestore';

interface AppState {
  currentUser: User | null;
  competencies: Record<string, Competency>;
  login: (role: User['role']) => void;
  logout: () => void;
  updateCompetencyMastery: (id: string, newMastery: number) => void;
  initializeFromFirestore: (
    uid: string,
    name: string,
    role: User['role'],
    designation?: string,
    profileData?: Partial<OfficialProfileInput>
  ) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  competencies: {},
  
  login: (role) => set({ 
    currentUser: { ...DEMO_USER, role } 
  }),
  
  logout: () => set({ currentUser: null, competencies: {} }),
  
  updateCompetencyMastery: async (id, newMastery) => {
    const state = get();
    const comp = state.competencies[id];
    const uid = state.currentUser?.id;
    if (!comp || !uid) return;
    
    const newStatus = calculateStatus(newMastery);
    
    // Update local state optimistically
    set({
      competencies: {
        ...state.competencies,
        [id]: {
          ...comp,
          mastery: newMastery,
          status: newStatus
        }
      }
    });

    // Update Firestore
    try {
      const compRef = doc(db, 'competencies', `${uid}_${id}`);
      await setDoc(compRef, {
        name: comp.name,
        category: comp.category,
        mastery: newMastery,
        prerequisites: comp.prerequisites,
        status: newStatus,
        userId: uid
      }, { merge: true });
    } catch (error) {
      console.error('Error updating competency:', error);
    }
  },

  initializeFromFirestore: async (
    uid: string,
    name: string,
    role: User['role'],
    designation?: string,
    profileData?: Partial<OfficialProfileInput>
  ) => {
    // Generate tailored baseline competencies if learner
    const generatedCompetencies = role === 'LEARNER' 
      ? generateCompetencyProfile({
          name: name || 'Aarav Sharma',
          designation: designation || profileData?.designation || 'Statistical Officer',
          department: profileData?.department || 'National Sample Survey Office (NSSO)',
          jobRole: profileData?.jobRole || 'Field Survey Supervisor & Quality Auditor',
          currentAssignment: profileData?.currentAssignment || 'Periodic Labour Force Survey (PLFS) 2026',
          educationalQualifications: profileData?.educationalQualifications || 'M.Sc. Statistics',
          workExperience: profileData?.workExperience || '3-5 Years in Official Statistics',
          previousTrainings: profileData?.previousTrainings || [
            'iGOT Karmayogi - Ethics & Governance in Public Service',
            'Sampling Theory & Design (NASA)',
            'Computer Assisted Personal Interviewing (CAPI) Tools',
          ],
        })
      : DEMO_COMPETENCIES;

    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      let currentUser: User;
      if (!userSnap.exists()) {
        currentUser = {
          id: uid,
          name: name || (role === 'LEARNER' ? 'Aarav Sharma' : 'Demo User'),
          role: role,
          department: profileData?.department || (role === 'LEARNER' ? 'National Sample Survey Office (NSSO)' : 'Department of Statistics'),
          designation: designation || profileData?.designation || (role === 'LEARNER' ? 'Statistical Officer' : 'Official'),
          jobRole: profileData?.jobRole || (role === 'LEARNER' ? 'Field Survey Supervisor & Quality Auditor' : undefined),
          currentAssignment: profileData?.currentAssignment || (role === 'LEARNER' ? 'Periodic Labour Force Survey (PLFS) 2026' : undefined),
          educationalQualifications: profileData?.educationalQualifications || (role === 'LEARNER' ? 'M.Sc. Statistics' : undefined),
          workExperience: profileData?.workExperience || (role === 'LEARNER' ? '3-5 Years in Official Statistics' : undefined),
          previousTrainings: profileData?.previousTrainings || (role === 'LEARNER' ? [
            'iGOT Karmayogi - Ethics & Governance in Public Service',
            'Sampling Theory & Design (NASA)',
          ] : undefined),
          competencyProfileGeneratedAt: new Date().toISOString(),
        };
        await setDoc(userRef, {
          name: currentUser.name,
          role: currentUser.role,
          department: currentUser.department,
          designation: currentUser.designation,
          jobRole: currentUser.jobRole || '',
          currentAssignment: currentUser.currentAssignment || '',
          educationalQualifications: currentUser.educationalQualifications || '',
          workExperience: currentUser.workExperience || '',
          previousTrainings: currentUser.previousTrainings || [],
          competencyProfileGeneratedAt: currentUser.competencyProfileGeneratedAt || '',
        });
      } else {
        const data = userSnap.data();
        currentUser = {
          id: uid,
          name: data.name || name,
          role: data.role || role,
          department: data.department || profileData?.department || 'National Sample Survey Office (NSSO)',
          designation: data.designation || designation || 'Statistical Officer',
          jobRole: data.jobRole || profileData?.jobRole,
          currentAssignment: data.currentAssignment || profileData?.currentAssignment,
          educationalQualifications: data.educationalQualifications || profileData?.educationalQualifications,
          workExperience: data.workExperience || profileData?.workExperience,
          previousTrainings: data.previousTrainings || profileData?.previousTrainings,
          competencyProfileGeneratedAt: data.competencyProfileGeneratedAt || new Date().toISOString(),
        };
      }

      // Fetch or seed competencies
      const compsRef = collection(db, 'competencies');
      const q = query(compsRef, where('userId', '==', uid));
      const compsSnap = await getDocs(q);
      
      let competencies: Record<string, Competency> = {};
      
      if (compsSnap.empty) {
        const batch = writeBatch(db);
        Object.entries(generatedCompetencies).forEach(([key, comp]) => {
          const docRef = doc(db, 'competencies', `${uid}_${key}`);
          batch.set(docRef, {
            name: comp.name,
            category: comp.category,
            mastery: comp.mastery,
            prerequisites: comp.prerequisites,
            status: comp.status,
            userId: uid
          });
          competencies[key] = { ...comp, id: key };
        });
        await batch.commit();
      } else {
        compsSnap.forEach(doc => {
          const data = doc.data();
          const originalId = doc.id.replace(`${uid}_`, '');
          competencies[originalId] = {
            id: originalId,
            name: data.name,
            category: data.category,
            mastery: data.mastery,
            prerequisites: data.prerequisites || [],
            status: data.status
          };
        });
      }

      set({ currentUser, competencies });
    } catch (error) {
      console.warn('Firestore sync failed, activating local offline session:', error);
      const fallbackUser: User = {
        id: uid,
        name: name || (role === 'LEARNER' ? 'Aarav Sharma' : role === 'MANAGER' ? 'Training Manager' : 'System Administrator'),
        role: role,
        department: profileData?.department || (role === 'LEARNER' ? 'National Sample Survey Office (NSSO)' : 'Statistical Operations'),
        designation: designation || profileData?.designation || (role === 'LEARNER' ? 'Statistical Officer' : role === 'MANAGER' ? 'Director of Training' : 'System Administrator'),
        jobRole: profileData?.jobRole || (role === 'LEARNER' ? 'Field Survey Supervisor & Quality Auditor' : undefined),
        currentAssignment: profileData?.currentAssignment || (role === 'LEARNER' ? 'Periodic Labour Force Survey (PLFS) 2026' : undefined),
        educationalQualifications: profileData?.educationalQualifications || (role === 'LEARNER' ? 'M.Sc. Statistics' : undefined),
        workExperience: profileData?.workExperience || (role === 'LEARNER' ? '3-5 Years in Official Statistics' : undefined),
        previousTrainings: profileData?.previousTrainings || (role === 'LEARNER' ? [
          'iGOT Karmayogi - Ethics & Governance in Public Service',
          'Sampling Theory & Design (NASA)',
          'Computer Assisted Personal Interviewing (CAPI) Tools',
        ] : undefined),
        competencyProfileGeneratedAt: new Date().toISOString(),
      };
      set({ 
        currentUser: fallbackUser, 
        competencies: generatedCompetencies 
      });
    }
  }
}));

