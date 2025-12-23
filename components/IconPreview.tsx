import React from 'react';
import { GeneratedIcon } from '../types';
import { Download, Share2, Smartphone } from 'lucide-react';

interface IconPreviewProps {
  icon: GeneratedIcon;
}

export const IconPreview: React.FC<IconPreviewProps> = ({ icon }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = icon.imageUrl;
    link.download = `iconcraft-${icon.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Main Large Preview */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center gap-6 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        
        <div className="relative group">
           {/* Glow effect */}
           <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
           
           <img 
             src={icon.imageUrl} 
             alt={icon.prompt} 
             className="w-48 h-48 md:w-64 md:h-64 rounded-3xl shadow-2xl relative z-10 transition-transform duration-300 group-hover:scale-105"
           />
        </div>

        <div className="flex gap-4 z-10">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-all shadow-lg hover:shadow-blue-500/30"
          >
            <Download size={18} />
            Download PNG
          </button>
        </div>
      </div>

      {/* Platform Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* iOS Preview */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 text-slate-400">
            <Smartphone size={20} />
            <h3 className="font-semibold text-sm uppercase tracking-wider">iOS Preview</h3>
          </div>
          
          <div className="flex items-center gap-6 justify-center bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center rounded-xl p-8 h-64 relative overflow-hidden group">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
            
            <div className="flex flex-col items-center gap-2 relative z-10">
              <img 
                src={icon.imageUrl} 
                alt="iOS Icon" 
                className="w-[60px] h-[60px] rounded-[22%] shadow-lg border-[0.5px] border-white/20"
              />
              <span className="text-[10px] text-white font-medium drop-shadow-md">My App</span>
            </div>
             <div className="flex flex-col items-center gap-2 relative z-10 opacity-75">
              <div className="w-[60px] h-[60px] rounded-[22%] bg-white/20 backdrop-blur-md"></div>
              <span className="text-[10px] text-white font-medium drop-shadow-md">Mail</span>
            </div>
             <div className="flex flex-col items-center gap-2 relative z-10 opacity-75">
              <div className="w-[60px] h-[60px] rounded-[22%] bg-green-500/80 backdrop-blur-md"></div>
              <span className="text-[10px] text-white font-medium drop-shadow-md">Phone</span>
            </div>
          </div>
        </div>

        {/* Android Preview */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 text-slate-400">
            <Smartphone size={20} />
            <h3 className="font-semibold text-sm uppercase tracking-wider">Android Preview</h3>
          </div>
          
          <div className="flex items-center gap-8 justify-center bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center rounded-xl p-8 h-64 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
            
            <div className="flex flex-col items-center gap-2 relative z-10">
              <img 
                src={icon.imageUrl} 
                alt="Android Icon" 
                className="w-[56px] h-[56px] rounded-full shadow-lg"
              />
              <span className="text-[11px] text-slate-100 drop-shadow-md">My App</span>
            </div>
             <div className="flex flex-col items-center gap-2 relative z-10 opacity-75">
              <div className="w-[56px] h-[56px] rounded-full bg-blue-500/80"></div>
              <span className="text-[11px] text-slate-100 drop-shadow-md">Chrome</span>
            </div>
             <div className="flex flex-col items-center gap-2 relative z-10 opacity-75">
              <div className="w-[56px] h-[56px] rounded-md bg-white/90"></div>
              <span className="text-[11px] text-slate-100 drop-shadow-md">Docs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};