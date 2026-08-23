import React, { useState, useEffect } from 'react';
import { PlayCircle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IgotMockService } from '../../../services/igot/igotMockService';

const igotService = new IgotMockService();

export const IgotMyLearning = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Mock loading learning progress and merging with details
        const progress = await igotService.getLearningProgress('mock-user');
        const detailedCourses = await Promise.all(
          progress.map(async p => {
             const details = await igotService.getTrainingDetails(p.courseId);
             return { ...details, progress: p.progress, learnerStatus: p.status };
          })
        );
        setCourses(detailedCourses);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My iGOT Learning</h1>
          <p className="text-slate-500">Track your progress on courses imported from iGOT Karmayogi.</p>
        </div>
        <Link to="/learner/igot/courses" className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50">
          Browse More
        </Link>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading your learning path...</div>
      ) : (
        <div className="space-y-4">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-2">
                   {course.learnerStatus === 'Completed' && <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded"><CheckCircle className="w-3.5 h-3.5"/> Completed</span>}
                   {course.learnerStatus === 'In Progress' && <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded"><Clock className="w-3.5 h-3.5"/> In Progress</span>}
                   {course.learnerStatus === 'Not Started' && <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">Not Started</span>}
                   <span className="text-xs text-slate-500">{course.provider}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{course.title}</h3>
                <div className="text-sm text-slate-500 line-clamp-1 mb-4">Competencies: {course.competencies.join(', ')}</div>
                
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden max-w-md">
                  <div 
                    className={`h-full ${course.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <div className="text-xs font-medium text-slate-500 mt-1">{course.progress}% Complete</div>
              </div>
              
              <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                 <Link to={`/learner/igot/course/${course.id}`} className="px-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 text-center">
                   Details
                 </Link>
                 <a href={course.courseUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 flex items-center justify-center gap-2">
                   <PlayCircle className="w-4 h-4" />
                   {course.progress === 0 ? 'Start Course' : 'Resume'}
                 </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
