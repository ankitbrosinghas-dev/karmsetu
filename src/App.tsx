import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage, LoginPage } from './pages/public/LandingPages';
import { MainLayout } from './components/layout/MainLayout';

// Learner Pages
import { LearnerDashboard } from './pages/learner/LearnerDashboard';
import { WhyWeak } from './pages/learner/WhyWeak';
import { AdaptivePractice } from './pages/learner/AdaptivePractice';
import { CompetencyPassport } from './pages/learner/CompetencyPassport';
import { CompetencyGraph } from './pages/learner/CompetencyGraph';
import { IgotProfile } from './pages/learner/IgotProfile';
import { IgotPortal } from './pages/learner/igot/IgotPortal';
import { IgotCatalogue } from './pages/learner/igot/IgotCatalogue';
import { IgotCourseDetails } from './pages/learner/igot/IgotCourseDetails';
import { IgotMyLearning } from './pages/learner/igot/IgotMyLearning';
import { CreateQuiz } from './pages/learner/CreateQuiz';

// Manager Pages
import { ManagerDashboard } from './pages/manager/ManagerDashboard';
import { MaterialUpload } from './pages/manager/MaterialUpload';
import { IgotManagerSearch } from './pages/manager/igot/IgotManagerSearch';
import { OverallUnderstanding } from './pages/manager/OverallUnderstanding';

// Admin Pages
import { IgotSettings } from './pages/admin/igot/IgotSettings';
import { IgotDashboard } from './pages/admin/igot/IgotDashboard';
import { IgotLogs } from './pages/admin/igot/IgotLogs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<MainLayout />}>
          {/* Learner Routes */}
          <Route path="/learner/dashboard" element={<LearnerDashboard />} />
          <Route path="/learner/why-weak" element={<WhyWeak />} />
          <Route path="/learner/practice" element={<AdaptivePractice />} />
          <Route path="/learner/passport" element={<CompetencyPassport />} />
          <Route path="/learner/igot-profile" element={<IgotProfile />} />
          <Route path="/learner/igot" element={<IgotPortal />} />
          <Route path="/learner/igot/courses" element={<IgotCatalogue />} />
          <Route path="/learner/igot/course/:courseId" element={<IgotCourseDetails />} />
          <Route path="/learner/igot/my-learning" element={<IgotMyLearning />} />
          <Route path="/learner/competency-graph" element={<CompetencyGraph />} />
          <Route path="/learner/create-quiz" element={<CreateQuiz />} />

          {/* Manager Routes */}
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/manager/materials" element={<MaterialUpload />} />
          <Route path="/manager/understanding" element={<OverallUnderstanding />} />
          <Route path="/manager/igot" element={<IgotManagerSearch />} />
          <Route path="/manager/heatmap" element={<div className="p-8 text-center text-slate-500">Department Heatmap (Mock)</div>} />
          <Route path="/manager/question-generator" element={<div className="p-8 text-center text-slate-500">AI Question Studio (Mock)</div>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<div className="p-8 text-center text-slate-500">Admin Dashboard (Mock)</div>} />
          <Route path="/admin/understanding" element={<OverallUnderstanding />} />
          <Route path="/admin/integrations/igot" element={<IgotSettings />} />
          <Route path="/admin/integrations/igot/dashboard" element={<IgotDashboard />} />
          <Route path="/admin/integrations/igot/logs" element={<IgotLogs />} />
          <Route path="/admin/users" element={<div className="p-8 text-center text-slate-500">User Management (Mock)</div>} />
          
          {/* Redirect old path if necessary */}
          <Route path="/admin/integrations" element={<Navigate to="/admin/integrations/igot" replace />} />
          <Route path="/learner/catalogue" element={<Navigate to="/learner/igot/courses" replace />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
