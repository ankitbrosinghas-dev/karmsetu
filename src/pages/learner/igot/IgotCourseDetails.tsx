import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Award, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { IgotMockService } from '../../../services/igot/igotMockService';
import { IgotCourse } from '../../../services/igot/igotTypes';

const igotService = new IgotMockService();

export const IgotCourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<IgotCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (courseId) {
          const data = await igotService.getTrainingDetails(courseId);
          setCourse(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading course details...</div>;
  if (!course) return <div className="p-8 text-center text-rose-500">Course not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Catalogue
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-bold rounded-lg">{course.category}</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg">{course.difficulty}</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> iGOT Karmayogi</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{course.title}</h1>
          <p className="text-lg text-slate-500 mb-6">{course.description}</p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">Provider:</span> {course.provider}
            </div>
            <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.duration}</div>
            <div className="flex items-center gap-1"><Award className="w-4 h-4" /> {course.certificateAvailable ? 'Certificate Available' : 'No Certificate'}</div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
               <CheckCircle2 className="w-6 h-6" />
             </div>
             <div>
               <div className="text-sm font-bold text-slate-900">87% Recommendation Match</div>
               <div className="text-xs text-slate-500">Matches your competency gap in Data Analysis</div>
             </div>
           </div>
           
           <div className="flex gap-3 w-full sm:w-auto">
             <button 
               onClick={() => setAdded(true)}
               disabled={added}
               className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
             >
               {added ? 'Added to Learning' : 'Add to My Learning'}
             </button>
             <a 
               href={course.courseUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
             >
               Open in iGOT <ExternalLink className="w-4 h-4" />
             </a>
           </div>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Mapped Competencies</h3>
            <div className="flex flex-wrap gap-2">
              {course.competencies.map((comp, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg">
                  {comp}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">KarmSetu Suggested Mapping</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
             <div>
               <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Language</div>
               <div className="text-sm font-medium text-slate-900">{course.language.join(', ')}</div>
             </div>
             <div>
               <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Type</div>
               <div className="text-sm font-medium text-slate-900">{course.courseType}</div>
             </div>
             <div>
               <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pricing</div>
               <div className="text-sm font-medium text-slate-900">{course.isFree ? 'Free' : 'Paid'}</div>
             </div>
             <div>
               <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Last Synced</div>
               <div className="text-sm font-medium text-slate-900">{new Date(course.lastSyncedAt).toLocaleDateString()}</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
