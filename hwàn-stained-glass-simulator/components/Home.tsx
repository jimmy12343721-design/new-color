import React from 'react';

interface HomeProps {
  onStart: () => void;
}

export const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-10 text-center bg-white animate-fade-in">
      {/* Updated Logo Container: Circular with Red Glow */}
      <div className="w-[180px] h-[180px] bg-white rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(225,90,100,0.35)] relative group border-4 border-white">
        <img 
          src="https://raw.githubusercontent.com/jimmy12343721-design/svg/main/logo.svg?v=1" 
          alt="HWÀN Logo" 
          className="w-[65%] h-[65%] object-contain transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/150x150?text=Logo';
          }}
        />
      </div>

      <h1 className="text-2xl font-bold text-gray-800 tracking-widest mb-1">奐奐 STUDIO</h1>
      <p className="text-gray-400 text-xs tracking-[0.3em] mb-12">STAINED GLASS</p>

      <div className="w-full max-w-sm space-y-8 text-left mb-16">
        <div className="space-y-6 px-4">
          <StepItem num={1} title="挑造型" desc="選擇自己預約的系列與作品" />
          <StepItem num={2} title="選玻璃" desc="下方色票庫挑選花色 (長按可放大預覽)" />
          <StepItem num={3} title="點填色" desc="直接點擊玻璃顏色，填入作品空白處" />
        </div>

        <div className="border-l-4 border-[#E15A64] bg-red-50 p-4 mx-4 rounded-r-lg">
          <h4 className="font-bold text-red-800 text-sm mb-2">玻璃色彩</h4>
          <p className="text-xs text-red-700 leading-relaxed mb-2">
            每片玻璃製作時擁有不同的色彩與紋理，即使是相同色號，也可能因光線、手機螢幕顯色而呈現不同效果。
          </p>
          <p className="text-xs text-red-700 leading-relaxed">
             若有顏色缺貨，我們會通知您協助換色或重新配色。
          </p>
        </div>
      </div>

      <button 
        onClick={onStart}
        className="bg-[#E15A64] text-white py-4 px-10 rounded-full font-bold text-lg border-2 border-[#E15A64] transition-all hover:scale-105 active:scale-95 shadow-[0_4px_15px_rgba(225,90,100,0.3)] flex items-center gap-2"
      >
        開始挑選顏色！ <i className="fas fa-arrow-right"></i>
      </button>
    </div>
  );
};

const StepItem: React.FC<{num: number, title: string, desc: string}> = ({num, title, desc}) => (
  <div className="flex gap-4 items-start">
    <div className="w-8 h-8 rounded-full border-2 border-[#E15A64] text-[#E15A64] flex items-center justify-center font-bold flex-shrink-0">
      {num}
    </div>
    <div>
      <div className="font-bold text-gray-800">{title}</div>
      <div className="text-sm text-gray-500 mt-1">{desc}</div>
    </div>
  </div>
);