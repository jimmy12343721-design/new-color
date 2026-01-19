import React, { useState } from 'react';
import { Home } from './components/Home';
import { GlassSelector } from './components/GlassSelector';
import { WorkDrawer } from './components/WorkDrawer';
import { Canvas } from './components/Canvas';
import { WORK_CATEGORIES, WORKS, TRANSPARENT_TEXTURE_IDS } from './constants';
import { WorkItem, ViewState } from './types';

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [currentWork, setCurrentWork] = useState<WorkItem>(WORKS[0]);
  const [selectedTexture, setSelectedTexture] = useState<{url: string, id: string} | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [peekTexture, setPeekTexture] = useState<{url: string, id: string} | null>(null);

  const handleStart = () => {
    setView('simulator');
    setDrawerOpen(true);
  };

  const activeCategoryKey = Object.keys(WORK_CATEGORIES).find(key => {
    const def = WORK_CATEGORIES[key];
    return currentWork.id >= def.range[0] && currentWork.id <= def.range[1];
  }) || 'ornaments';

  const isPeekTransparent = peekTexture && TRANSPARENT_TEXTURE_IDS.includes(peekTexture.id);

  return (
    <div className="w-full h-[100dvh] flex flex-col overflow-hidden bg-white">
      {view === 'home' ? (
        <Home onStart={handleStart} />
      ) : (
        <>
           {/* Header */}
           <header className="h-[60px] bg-white border-b border-gray-200 flex items-center justify-between px-4 z-20 shadow-sm flex-shrink-0">
             <div className="flex items-center gap-3" onClick={() => setDrawerOpen(true)}>
               <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden p-1 cursor-pointer hover:border-[#E15A64] transition-colors">
                  <img src={`https://raw.githubusercontent.com/jimmy12343721-design/svg/main/logo.svg`} className="w-full h-full object-contain" alt="Logo" />
               </div>
               <div>
                  <div className="text-[10px] text-gray-400 font-bold tracking-wider">PROJECT</div>
                  <div className="text-sm font-bold text-gray-800 flex items-center gap-1 cursor-pointer hover:text-[#E15A64] transition-colors">
                    {currentWork.label} 
                    <i className="fas fa-chevron-down text-xs text-[#E15A64]"></i>
                  </div>
               </div>
             </div>
             
             <button onClick={() => setView('home')} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#E15A64] transition-colors rounded-full hover:bg-red-50">
                <i className="fas fa-home"></i>
             </button>
           </header>

           {/* Main Layout */}
           <div className="flex-1 flex overflow-hidden relative">
              {/* Canvas Area */}
              <div className="flex-1 bg-gray-50 relative z-0 flex items-center justify-center">
                  <Canvas 
                    work={currentWork} 
                    textureUrl={selectedTexture?.url || null}
                    textureId={selectedTexture?.id || null}
                  />
                  
                  {/* Peek Overlay */}
                  {peekTexture && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 pointer-events-none bg-black/40 backdrop-blur-sm animate-fade-in">
                       <div className="bg-white p-1.5 rounded-xl shadow-2xl border-2 border-white max-w-[95vw] max-h-[90vh] flex items-center justify-center relative">
                         <div className="relative">
                            <img 
                              src={peekTexture.url} 
                              className="max-w-full max-h-[85vh] object-contain rounded-lg" 
                              alt="Preview" 
                            />
                            {isPeekTransparent && (
                              <div className="absolute top-3 right-3 w-4 h-4 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.3)] z-10"></div>
                            )}
                         </div>
                       </div>
                    </div>
                  )}
              </div>

              {/* Sidebar */}
              <div className="w-[110px] sm:w-[140px] border-l border-gray-200 h-full z-10 flex-shrink-0 shadow-[-5px_0_15px_rgba(0,0,0,0.02)]">
                 <GlassSelector 
                   selectedId={selectedTexture?.id || null}
                   onSelectTexture={(url, id) => setSelectedTexture({url, id})}
                   onPeek={(url, id) => setPeekTexture({url, id})}
                   onPeekEnd={() => setPeekTexture(null)}
                 />
              </div>
           </div>

           {/* Drawer */}
           <WorkDrawer 
             isOpen={isDrawerOpen} 
             onClose={() => setDrawerOpen(false)}
             onSelectWork={setCurrentWork}
             activeCategoryKey={activeCategoryKey}
           />
        </>
      )}
    </div>
  );
}