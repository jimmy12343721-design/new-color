import React, { useState, useRef } from 'react';
import { CATEGORIES, TEXTURE_REPO, TEXTURE_LARGE_REPO, TRANSPARENT_TEXTURE_IDS } from '../constants';

interface GlassSelectorProps {
  onSelectTexture: (url: string, id: string) => void;
  selectedId: string | null;
  onPeek: (url: string, id: string) => void;
  onPeekEnd: () => void;
}

export const GlassSelector: React.FC<GlassSelectorProps> = ({ 
  onSelectTexture, 
  selectedId,
  onPeek,
  onPeekEnd
}) => {
  const [openCategory, setOpenCategory] = useState<number>(0);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTouchStart = (url: string, id: string) => {
    pressTimer.current = setTimeout(() => {
      onPeek(url, id);
    }, 250); // Reduced from 400ms to 250ms
  };

  const handleTouchEnd = (url: string, id: string) => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    onPeekEnd();
  };

  const handleClick = (url: string, id: string) => {
    onSelectTexture(url, id);
  };

  return (
    <div className="h-full bg-white flex flex-col">
       <div className="p-3 text-[10px] text-center text-gray-400 bg-white border-b border-gray-100 flex-shrink-0 leading-tight">
         <div className="mb-1 text-gray-500 font-bold"><i className="fas fa-hand-pointer mr-1"></i> 備註：長按色票可放大檢視</div>
         <div className="text-[9px] text-gray-400 transform scale-95">（圖中帶有白色圓點標示，代表該色為透明或半透明）</div>
       </div>
       
       <div className="flex-1 overflow-y-auto">
         {CATEGORIES.map((cat, idx) => (
           <div key={cat.name} className="border-b border-gray-100">
             <div 
               className={`px-4 py-3 font-bold text-sm cursor-pointer flex justify-between items-center transition-colors hover:text-[#E15A64] ${openCategory === idx ? 'text-[#333]' : 'text-gray-600'}`}
               onClick={() => setOpenCategory(openCategory === idx ? -1 : idx)}
             >
               {cat.name}
               <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${openCategory === idx ? 'rotate-180 text-[#E15A64]' : 'text-gray-300'}`}></i>
             </div>
             
             <div 
               className={`overflow-hidden transition-[max-height] duration-500 ease-in-out bg-white`}
               style={{ maxHeight: openCategory === idx ? '2000px' : '0px' }}
             >
               <div className="grid grid-cols-2 gap-x-3 gap-y-5 p-4 pt-1 pb-6">
                 {Array.from({ length: cat.count }).map((_, i) => {
                   const num = i + 1;
                   const id = `${cat.prefix}${String(num).padStart(2, '0')}`;
                   const thumbUrl = `${TEXTURE_REPO}${id}.jpg`;
                   const largeUrl = `${TEXTURE_LARGE_REPO}${id}.jpg`;
                   const isSelected = selectedId === id;
                   const isTransparent = TRANSPARENT_TEXTURE_IDS.includes(id);

                   return (
                     <div 
                       key={id}
                       className="flex flex-col gap-1.5 group cursor-pointer"
                       onClick={() => handleClick(thumbUrl, id)}
                     >
                       <div 
                         className={`relative aspect-square rounded-lg bg-cover bg-center border border-gray-200 select-none touch-none transition-all shadow-sm group-hover:shadow-md ${isSelected ? 'ring-2 ring-[#E15A64] ring-offset-2 border-[#E15A64]' : ''}`}
                         style={{ backgroundImage: `url(${thumbUrl})` }}
                         onMouseDown={() => handleTouchStart(largeUrl, id)}
                         onMouseUp={() => handleTouchEnd(largeUrl, id)}
                         onMouseLeave={() => handleTouchEnd(largeUrl, id)}
                         onTouchStart={() => handleTouchStart(largeUrl, id)}
                         onTouchEnd={() => handleTouchEnd(largeUrl, id)}
                       >
                         {isTransparent && (
                           <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] z-10 pointer-events-none"></div>
                         )}
                       </div>
                       <div className={`text-center text-[10px] font-bold leading-none ${isSelected ? 'text-[#E15A64]' : 'text-gray-400 group-hover:text-gray-600'}`}>
                         {id}
                       </div>
                     </div>
                   );
                 })}
               </div>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
};