import { create } from 'zustand';
import { User, Competency, DEMO_USER, DEMO_COMPETENCIES, calculateStatus } from './mockData';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, getDocs, query, where, writeBatch } from 'firebase/firestore';

interface AppState {
  currentUser: User | null;
  competencies: Record<string, Competency>;
  login: (role: User['role']) => void;
  logout: () => void;
  updateCompetencyMastery: (id: string, newMastery: number) => void;
  initializeFromFirestore: (uid: string, name: string, role: User['role'], designation?: string) => Promise<void>;
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

  initializeFromFirestore: async (uid: string, name: string, role: User['role'], designation?: string) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      let currentUser: User;
      if (!userSnap.exists()) {
        // Create user
        currentUser = {
          id: uid,
          name: name || 'Demo User',
          role: role,
          department: 'Statistical Operations',
          designation: designation || 'Statistical Officer'
        };
        await setDoc(userRef, {
          name: currentUser.name,
          role: currentUser.role,
          department: currentUser.department,
          designation: currentUser.designation
        });
      } else {
        const data = userSnap.data();
        currentUser = {
          id: uid,
          name: data.name,
          role: data.role,
          department: data.department,
          designation: data.designation
        };
      }

      // Fetch competencies
      const compsRef = collection(db, 'competencies');
      const q = query(compsRef, where('userId', '==', uid));
      const compsSnap = await getDocs(q);
      
      let competencies: Record<string, Competency> = {};
      
      if (compsSnap.empty) {
        // Seed default competencies
        const batch = writeBatch(db);
        Object.entries(DEMO_COMPETENCIES).forEach(([key, comp]) => {
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
          // Extract original id from document ID (uid_id)
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
        department: 'Statistical Operations',
        designation: designation || (role === 'LEARNER' ? 'Statistical Officer' : role === 'MANAGER' ? 'Director of Training' : 'System Administrator')
      };
      set({ 
        currentUser: fallbackUser, 
        competencies: { ...DEMO_COMPETENCIES } 
      });
    }
  }
}));

