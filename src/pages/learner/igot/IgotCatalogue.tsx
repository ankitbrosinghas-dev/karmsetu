import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, Award, ChevronRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { igotCourseService } from '../../../services/igot/igotCourseService';
import { IgotCourse } from '../../../services/igot/igotTypes';


export const IgotCatalogue = () => {
  const [courses, setCourses] = useState<IgotCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ topic: 'All', provider: 'All', difficulty: 'All' });

  
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    loadCourses();
  }, [debouncedQuery, filters]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      // Utilizing igotCourseService to handle dynamic queries
      const data = await igotCourseService.searchCourses(debouncedQuery, filters);
      setCourses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Training Catalogue</h1>
          <p className="text-slate-500">Discover and enroll in synchronized iGOT courses.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search iGOT courses by title, topic, or competency..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={filters.topic}
            onChange={(e) => setFilters(f => ({...f, topic: e.target.value}))}
            className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Topics</option>
            <option value="Data & Technology">Data & Technology</option>
            <option value="Governance">Governance</option>
            <option value="Law">Law</option>
            <option value="Project Management">Project Management</option>
          </select>
          <select 
            value={filters.difficulty}
            onChange={(e) => setFilters(f => ({...f, difficulty: e.target.value}))}
            className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading courses...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-blue-300 transition-colors flex flex-col h-full">
              <div className="flex items-start justify-between mb-3">
                {course.isRecommended ? (
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md">Recommended</span>
                ) : (
                  <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-1 rounded-md">{course.difficulty}</span>
                )}
                <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-md">{course.category}</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1 leading-snug">{course.title}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{course.description}</p>
              
              <div className="mt-auto space-y-3">
                <div className="text-xs font-medium text-slate-600">{course.provider}</div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                  {course.certificateAvailable && <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Certificate</span>}
                </div>
                <div className="flex flex-wrap gap-1">
                  {course.competencies.slice(0, 2).map((comp, idx) => (
                     <span key={idx} className="text-[10px] uppercase font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{comp}</span>
                  ))}
                  {course.competencies.length > 2 && <span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">+{course.competencies.length - 2}</span>}
                </div>
                <div className="pt-3 border-t border-slate-100 flex gap-2">
                  <Link to={`/learner/igot/course/${course.id}`} className="flex-1 text-center py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-colors">Details</Link>
                  <a href={course.courseUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1">iGOT <ExternalLink className="w-3.5 h-3.5"/></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
