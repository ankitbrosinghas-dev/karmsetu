import React, { useState, useEffect } from 'react';
import { Search, Filter, Share2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IgotMockService } from '../../../services/igot/igotMockService';
import { IgotCourse } from '../../../services/igot/igotTypes';

const igotService = new IgotMockService();

export const IgotManagerSearch = () => {
  const [courses, setCourses] = useState<IgotCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCourses();
  }, [searchQuery]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await igotService.getTrainingCatalogue(searchQuery);
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
          <h1 className="text-2xl font-bold text-slate-900">iGOT Course Discovery</h1>
          <p className="text-slate-500">Search and recommend official iGOT courses to your team.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search catalogue..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading catalogue...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Provider</th>
                <th className="px-6 py-4">Topic</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map(course => (
                <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{course.title}</div>
                    <div className="text-xs text-slate-500 line-clamp-1">{course.competencies.join(', ')}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{course.provider}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{course.topic}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                     <button className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg inline-flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> Recommend</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
