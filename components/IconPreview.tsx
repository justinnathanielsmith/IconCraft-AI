import React, { useState } from 'react';
import { GeneratedIcon } from '../types';
import { Smartphone, Monitor, Loader2, Archive, Apple, Square, Zap } from 'lucide-react';
import JSZip from 'jszip';

interface IconPreviewProps {
  icon: GeneratedIcon;
}

type FileFormat = 'PNG' | 'JPG' | 'SVG' | 'LINUX' | 'ICO' | 'ICNS' | 'WEBP';

// Memoized to prevent re-renders when parent state (like prompt input) changes but icon is stable
export const IconPreview: React.FC<IconPreviewProps> = React.memo(({ icon }) => {
  const [isZipping, setIsZipping] = useState(false);

  const generateAsset = async (targetFormat: FileFormat, img: HTMLImageElement): Promise<{ dataUrl: string, filename: string }> => {
    let downloadUrl = icon.imageUrl;
    let filename = `iconcraft-${icon.id}.${targetFormat === 'LINUX' ? 'png' : targetFormat.toLowerCase()}`;

    if (targetFormat === 'JPG') {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        downloadUrl = canvas.toDataURL('image/jpeg', 0.9);
      }
    } else if (targetFormat === 'WEBP') {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        downloadUrl = canvas.toDataURL('image/webp', 0.9);
      }
    } else if (targetFormat === 'SVG') {
      const svgBody = `<svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}" viewBox="0 0 ${img.width} ${img.height}"><image href="${icon.imageUrl}" width="${img.width}" height="${img.height}" /></svg>`;
      const blob = new Blob([svgBody], { type: 'image/svg+xml;charset=utf-8' });
      downloadUrl = URL.createObjectURL(blob);
    } else if (targetFormat === 'LINUX') {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, 512, 512);
        downloadUrl = canvas.toDataURL('image/png');
        filename = `LinuxIcon.png`;
      }
    } else if (targetFormat === 'ICO') {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, 256, 256);
        downloadUrl = canvas.toDataURL('image/png');
        filename = `WindowsIcon.ico`;
      }
    } else if (targetFormat === 'ICNS') {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, 1024, 1024);
        downloadUrl = canvas.toDataURL('image/png');
        filename = `MacosIcon.icns`;
      }
    }

    return { dataUrl: downloadUrl, filename };
  };

  const generateReadme = () => {
    return `# IconCraft AI - Resource Package

This package contains your generated icon in multiple formats for different platforms.

## File Usage Guide:

1. **PNG & WEBP**: High-resolution raster images. Ideal for general web use, Android app resources, or documentation.
2. **SVG**: Scalable Vector Graphics. Best for web integration and UI design as it scales perfectly to any size.
3. **WindowsIcon.ico**: Standard Windows icon format. Supports multiple sizes (up to 256px). Use this for Windows application shortcuts.
4. **MacosIcon.icns**: Apple Icon Image format. High-quality resource for macOS application bundles (up to 1024px).
5. **LinuxIcon.png**: 512x512 PNG optimized for Linux desktop environments and flatpak/snap packaging.
6. **JPG**: Compressed version with a white background. Useful for profile pictures or platforms that don't support transparency.

## App Details:
- **Prompt**: ${icon.prompt}
- **Style**: ${icon.style}
- **Generated**: ${new Date(icon.createdAt).toLocaleString()}

Thank you for using IconCraft AI!`;
  };

  const handleDownloadAll = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const img = new Image();
      img.src = icon.imageUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const formats: FileFormat[] = ['PNG', 'JPG', 'WEBP', 'SVG', 'LINUX', 'ICO', 'ICNS'];
      
      for (const f of formats) {
        const { dataUrl, filename } = await generateAsset(f, img);
        let content: any;
        
        if (f === 'SVG') {
          const response = await fetch(dataUrl);
          content = await response.blob();
          URL.revokeObjectURL(dataUrl);
        } else {
          const base64Data = dataUrl.split(',')[1];
          content = base64Data;
        }
        
        zip.file(filename, content, { base64: f !== 'SVG' });
      }

      zip.file("README.md", generateReadme());

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);
      
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `icon-package-${icon.id}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);
    } catch (error) {
      console.error("Zip generation failed:", error);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Main Large Preview */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center gap-6 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        
        <div className="relative group cursor-pointer">
           {/* Dynamic Glow Layer */}
           <div className="absolute -inset-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
           
           <img 
             src={icon.imageUrl} 
             alt={icon.prompt} 
             className="w-48 h-48 md:w-64 md:h-64 rounded-[22%] shadow-2xl relative z-10 transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-[0_0_50px_rgba(79,70,229,0.4)] border border-white/5"
           />
        </div>

        <div className="flex flex-col gap-4 items-center z-10 relative">
          <button
            onClick={handleDownloadAll}
            disabled={isZipping}
            className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full transition-all disabled:opacity-50 shadow-xl shadow-indigo-500/20 active:scale-95 group"
          >
            {isZipping ? <Loader2 size={20} className="animate-spin" /> : <Archive size={20} className="group-hover:rotate-12 transition-transform" />}
            Download All Formats (.zip)
          </button>
          <p className="text-slate-500 text-xs text-center max-w-[240px]">
            Includes high-res PNG, JPG, WEBP, SVG, platform-specific ICO/ICNS files, and a README.
          </p>
        </div>
      </div>

      {/* Platform Previews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* iOS Preview */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 text-slate-400">
            <Smartphone size={18} />
            <h3 className="font-semibold text-xs uppercase tracking-widest">iOS Preview</h3>
          </div>
          <div className="flex items-center gap-6 justify-center bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center rounded-xl p-8 h-48 relative overflow-hidden group">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
            <div className="flex flex-col items-center gap-2 relative z-10">
              <img src={icon.imageUrl} alt="iOS Icon" className="w-[52px] h-[52px] rounded-[22%] shadow-lg border-[0.5px] border-white/20" />
              <span className="text-[9px] text-white font-medium drop-shadow-md">My App</span>
            </div>
            <div className="flex flex-col items-center gap-2 relative z-10 opacity-75 hidden sm:flex">
              <div className="w-[52px] h-[52px] rounded-[22%] bg-white/20 backdrop-blur-md"></div>
              <span className="text-[9px] text-white font-medium drop-shadow-md">Mail</span>
            </div>
          </div>
        </div>

        {/* Android Preview */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 text-slate-400">
            <Smartphone size={18} />
            <h3 className="font-semibold text-xs uppercase tracking-widest">Android Preview</h3>
          </div>
          <div className="flex items-center gap-8 justify-center bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center rounded-xl p-8 h-48 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
            <div className="flex flex-col items-center gap-2 relative z-10">
              <img src={icon.imageUrl} alt="Android Icon" className="w-[52px] h-[52px] rounded-full shadow-lg" />
              <span className="text-[10px] text-slate-100 drop-shadow-md">My App</span>
            </div>
            <div className="flex flex-col items-center gap-2 relative z-10 opacity-75 hidden sm:flex">
              <div className="w-[52px] h-[52px] rounded-full bg-blue-500/80"></div>
              <span className="text-[10px] text-slate-100 drop-shadow-md">Chrome</span>
            </div>
          </div>
        </div>

        {/* Android Splash Screen Preview */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 text-slate-400">
            <Zap size={18} />
            <h3 className="font-semibold text-xs uppercase tracking-widest">Android Splash</h3>
          </div>
          <div className="flex items-center justify-center bg-slate-900 rounded-xl border border-slate-800 h-48 relative overflow-hidden">
             {/* Simulating a phone screen */}
             <div className="w-32 h-full bg-[#0a0a0a] relative flex items-center justify-center border-x-[1px] border-slate-800">
                {/* Simulated status bar */}
                <div className="absolute top-2 w-full px-3 flex justify-between opacity-50">
                    <div className="w-8 h-1 bg-white rounded-full"></div>
                    <div className="w-2 h-2 rounded-full border border-white"></div>
                </div>
                {/* The splash icon (Adaptive) */}
                <div className="relative z-10 flex flex-col items-center animate-pulse">
                    <img src={icon.imageUrl} alt="Splash Icon" className="w-16 h-16 rounded-full shadow-lg mb-4" />
                </div>
             </div>
          </div>
        </div>

        {/* macOS Dock Preview */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 text-slate-400">
            <Apple size={18} />
            <h3 className="font-semibold text-xs uppercase tracking-widest">macOS Dock</h3>
          </div>
          <div className="flex items-end justify-center bg-[url('https://images.unsplash.com/photo-1502230831726-fe5506c6cb41?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center rounded-xl p-4 h-48 relative overflow-hidden group">
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative z-10 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-2 flex items-center gap-3 shadow-2xl scale-90 sm:scale-100">
              <div className="w-10 h-10 rounded-lg bg-white/20"></div>
              <div className="w-10 h-10 rounded-lg bg-orange-500/50"></div>
              <img src={icon.imageUrl} alt="macOS Icon" className="w-12 h-12 rounded-xl shadow-xl border border-white/10 transition-transform hover:-translate-y-2" />
              <div className="w-10 h-10 rounded-lg bg-blue-500/50"></div>
              <div className="w-10 h-10 rounded-lg bg-green-500/50"></div>
            </div>
          </div>
        </div>

        {/* Windows Taskbar Preview */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 text-slate-400">
            <Monitor size={18} />
            <h3 className="font-semibold text-xs uppercase tracking-widest">Windows Taskbar</h3>
          </div>
          <div className="flex items-end justify-center bg-[url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center rounded-xl p-0 h-48 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="w-full bg-black/60 backdrop-blur-xl h-10 flex items-center justify-center px-4 gap-1 border-t border-white/5">
              <div className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center transition-colors"><Square className="text-blue-400 fill-blue-400" size={14} /></div>
              <div className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center transition-colors"><div className="w-4 h-4 bg-white/40 rounded-sm"></div></div>
              <div className="w-10 h-10 border-b-2 border-blue-500 flex items-center justify-center">
                <img src={icon.imageUrl} alt="Windows Icon" className="w-6 h-6 rounded-sm shadow-md" />
              </div>
              <div className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center transition-colors"><div className="w-4 h-4 bg-yellow-500/40 rounded-sm"></div></div>
              <div className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center transition-colors"><div className="w-4 h-4 bg-red-500/40 rounded-sm"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});