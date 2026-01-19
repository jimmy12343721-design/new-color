import React, { useState } from 'react';
import { WORK_CATEGORIES, WORKS } from '../constants';
import { WorkItem } from '../types';

interface WorkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWork: (work: WorkItem) => void;
  activeCategoryKey: string;
}

// Explicitly define the display order of categories to prevent Object.keys() instability
const CATEGORY_ORDER = ['ornaments', 'medium', 'mirror', 'large_butterfly', 'lamps'];

export const WorkDrawer: React.FC<WorkDrawerProps> = ({ 
  isOpen, 
  onClose, 
  onSelectWork,
  activeCategoryKey
}) => {
  const [currentCat, setCurrentCat] = useState(activeCategoryKey || 'ornaments');

  const currentCategoryDef = WORK_CATEGORIES[currentCat];
  
  // Filter and Force Sort by ID to ensure correct display order
  const filteredWorks = WORKS.filter(w => 
    w.id >= currentCategoryDef.range[0] && w.id <= currentCategoryDef.range[1]
  ).sort((a, b) => a.id - b.id);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-white/80 z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className={`fixed top-[60px] left-0 w-full bg-white z-40 border-b-2 border-[#E15A64] shadow-lg flex flex-col max-h-[70vh] transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : '-translate-y-[120%]'}`}>
        
        <div className="text-xs text-gray-400 text-center py-2 bg-gray-50 border-b border-gray-100">
           先選擇作品系列，再挑選具體造型
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 p-4 border-b border-gray-50 bg-white">
          {CATEGORY_ORDER.map(key => (
            <button
              key={key}
              onClick={() => setCurrentCat(key)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 transition-colors ${
                currentCat === key 
                  ? 'bg-[#E15A64] text-white border-[#E15A64]' 
                  : 'bg-white text-[#E15A64] border-[#E15A64]'
              }`}
            >
              {WORK_CATEGORIES[key].title}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="overflow-y-auto p-5 grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-3 pb-8">
          {filteredWorks.map(work => (
            <div 
              key={work.id}
              onClick={() => {
                onSelectWork(work);
                onClose();
              }}
              className="border border-gray-100 rounded-xl h-[100px] flex flex-col items-center justify-center cursor-pointer hover:border-[#E15A64] hover:text-[#E15A64] text-gray-400 transition-colors group bg-white"
            >
              <i className="fas fa-shapes fa-2x mb-2 text-gray-200 group-hover:text-[#E15A64] transition-colors"></i>
              <div className="text-[10px] font-bold text-center leading-tight px-1 text-gray-600 group-hover:text-[#E15A64]">
                {String(work.id).padStart(2, '0')}<br/>{work.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};