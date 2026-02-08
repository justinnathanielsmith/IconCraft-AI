import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Wand2, Sparkles, AlertCircle, History, Edit3, MessageSquare, ChevronDown, Upload, X, Image as ImageIcon, Key } from 'lucide-react';
import { IconStyle, GeneratedIcon, GenerationState } from './types';
import { generateAppIcon } from './services/geminiService';
import { IconPreview } from './components/IconPreview';
import { KMPInstructions } from './components/KMPInstructions';
import { IconEditor } from './components/IconEditor';

// Pre-calculate display names for O(1) lookup
const STYLE_DISPLAY_NAMES: Record<string, string> = Object.keys(IconStyle).reduce((acc, key) => {
  const styleValue = IconStyle[key as keyof typeof IconStyle];
  acc[styleValue] = key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ');
  return acc;
}, {} as Record<string, string>);

// Mapping styles to representative preview images (Unsplash)
const STYLE_PREVIEWS: Record<IconStyle, string> = {
  [IconStyle.MINIMALIST]: "https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=400&q=80",
  [IconStyle.NEUMORPHIC]: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
  [IconStyle.GRADIENT]: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=400&q=80",
  [IconStyle.PIXEL_ART]: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80",
  [IconStyle.REALISTIC]: "https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=400&q=80",
  [IconStyle.SKETCH]: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=400&q=80",
  [IconStyle.GLASSMORPHISM]: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=400&q=80",
  [IconStyle.CLAYMORPHIC]: "https://images.unsplash.com/photo-1517849645529-147f273c913d?auto=format&fit=crop&w=400&q=80",
  [IconStyle.CYBERPUNK]: "https://images.unsplash.com/photo-1515630278258-407f66498911?auto=format&fit=crop&w=400&q=80",
  [IconStyle.ISOMETRIC]: "https://images.unsplash.com/photo-1529339031639-5395864a6018?auto=format&fit=crop&w=400&q=80",
  [IconStyle.KAWAII]: "https://images.unsplash.com/photo-1556983852-431c377955f0?auto=format&fit=crop&w=400&q=80",
  [IconStyle.CORPORATE]: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80",
  [IconStyle.VINTAGE_BADGE]: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80",
  [IconStyle.STAINED_GLASS]: "https://images.unsplash.com/photo-1502054824840-5f006020ac83?auto=format&fit=crop&w=400&q=80",
  [IconStyle.ORIGAMI]: "https://images.unsplash.com/photo-1503525547514-91eb7fab7092?auto=format&fit=crop&w=400&q=80",
  [IconStyle.WATERCOLOR]: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80",
  [IconStyle.HOLOGRAPHIC]: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=80",
  [IconStyle.CHALKBOARD]: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=400&q=80",
  [IconStyle.POP_ART]: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=400&q=80",
  [IconStyle.WOOD_CARVED]: "https://images.unsplash.com/photo-1610219760738-111d4e74747c?auto=format&fit=crop&w=400&q=80",
  [IconStyle.FUTURISTIC_UI]: "https://images.unsplash.com/photo-1514820402329-de527fdd2d08?auto=format&fit=crop&w=400&q=80",
  [IconStyle.GUMMY]: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80",
};

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<IconStyle>(IconStyle.MINIMALIST);
  const [styleDescription, setStyleDescription] = useState<string>(IconStyle.MINIMALIST);
  const [generatedIcon, setGeneratedIcon] = useState<GeneratedIcon | null>(null);
  const [status, setStatus] = useState<GenerationState>({ isLoading: false, error: null });
  const [history, setHistory] = useState<GeneratedIcon[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [seedImage, setSeedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    if (prompt.length > 300) {
      setStatus({ isLoading: false, error: "Prompt is too long (max 300 chars)" });
      return;
    }

    if (styleDescription.length > 100) {
      setStatus({ isLoading: false, error: "Style description is too long (max 100 chars)" });
      return;
    }

    setStatus({ isLoading: true, error: null });

    try {
      const base64Image = await generateAppIcon(prompt, styleDescription as IconStyle, seedImage || undefined);
      const newIcon: GeneratedIcon = {
        id: crypto.randomUUID(),
        imageUrl: base64Image,
        prompt,
        style: selectedStyle,
        createdAt: Date.now(),
      };

      setGeneratedIcon(newIcon);
      setHistory(prev => [newIcon, ...prev].slice(0, 5));
      setIsEditing(false);
    } catch (error) {
      setStatus({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to generate icon" 
      });
    } finally {
      setStatus(prev => ({ ...prev, isLoading: false }));
    }
  };

  const processFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setStatus({ isLoading: false, error: "File size must be less than 5MB" });
      return;
    }

    if (!file.type.startsWith('image/')) {
      setStatus({ isLoading: false, error: "Only image files are allowed" });
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        setSeedImage(event.target.result as string);
        setStatus({ isLoading: false, error: null });
      }
    };

    reader.onerror = () => {
      setStatus({ isLoading: false, error: "Failed to read file" });
    };

    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveSeedImage = () => {
    setSeedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpdateIcon = (newImageUrl: string) => {
    if (!generatedIcon) return;
    const updatedIcon = { ...generatedIcon, imageUrl: newImageUrl };
    setGeneratedIcon(updatedIcon);
    setHistory(prev => prev.map(h => h.id === updatedIcon.id ? updatedIcon : h));
    setIsEditing(false);
  };

  const loadFromHistory = (icon: GeneratedIcon) => {
    setGeneratedIcon(icon);
    setPrompt(icon.prompt);
    setSelectedStyle(icon.style);
    setStyleDescription(icon.style);
    setIsEditing(false);
  };

  const getStyleDisplayName = (style: IconStyle) => STYLE_DISPLAY_NAMES[style] || 'Custom';

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 pb-20">
      <header className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              IconCraft AI
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Key size={16} className="text-slate-500" />
            <input
              type="password"
              aria-label="Gemini API Key"
              placeholder="Enter API Key"
              className="bg-transparent border border-slate-700 rounded-full px-3 py-1 text-xs text-slate-400 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-32 focus:w-48 transition-all"
              onChange={(e) => localStorage.setItem('GEMINI_API_KEY', e.target.value)}
              defaultValue={localStorage.getItem('GEMINI_API_KEY') || ''}
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold leading-tight">
                Design stunning app icons <br />
                <span className="text-indigo-400">in seconds.</span>
              </h2>
              <p className="text-slate-400">
                Describe your app or provide a reference image, and let AI create professional assets for Android and iOS.
              </p>
            </div>

            <div className="space-y-6">
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="prompt-input" className="block text-sm font-medium text-slate-300">
                      What is your app about?
                    </label>
                    <span className="text-xs text-slate-500 font-mono">
                      {prompt.length}/300
                    </span>
                  </div>
                  <textarea
                    id="prompt-input"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. A fast rocket delivery service, red and white theme..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none h-24"
                    required
                    maxLength={300}
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="style-select" className="block text-sm font-medium text-slate-300">
                      Choose a style
                    </label>
                    <div className="relative group">
                      <select
                        id="style-select"
                        value={selectedStyle}
                        onChange={(e) => {
                          const style = e.target.value as IconStyle;
                          setSelectedStyle(style);
                          setStyleDescription(style);
                        }}
                        className="w-full appearance-none bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer outline-none pr-10"
                      >
                        {(Object.keys(IconStyle) as Array<keyof typeof IconStyle>).map((key) => (
                          <option key={key} value={IconStyle[key]} className="bg-slate-900 text-slate-200">
                            {STYLE_DISPLAY_NAMES[IconStyle[key]]}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <ChevronDown size={18} />
                      </div>
                    </div>

                    {/* Style Visual Preview */}
                    <div className="relative group overflow-hidden rounded-xl border border-slate-700 h-24 mt-2 transition-all hover:border-indigo-500/50">
                      <img 
                        src={STYLE_PREVIEWS[selectedStyle] || "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?w=400&q=80"} 
                        alt={selectedStyle}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent flex flex-col justify-center px-5 pointer-events-none">
                        <h3 className="text-white font-bold text-lg">{getStyleDisplayName(selectedStyle)}</h3>
                        <p className="text-slate-400 text-xs max-w-[220px] line-clamp-2 leading-relaxed opacity-90">
                          {selectedStyle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Seed Image Upload Section */}
                  <div className="space-y-2">
                    <label className="flex items-center justify-between text-sm font-medium text-slate-300">
                      <span>Reference Image (Optional)</span>
                      {seedImage && (
                        <span className="text-xs text-indigo-400 font-normal">Image selected</span>
                      )}
                    </label>
                    
                    {!seedImage ? (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`w-full h-24 border border-dashed rounded-xl transition-all flex flex-col items-center justify-center gap-2 group ${
                          isDragging
                            ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                            : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-500 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <Upload size={20} className={`transition-transform ${isDragging ? 'scale-110' : 'group-hover:scale-110'}`} />
                        <span className="text-xs">{isDragging ? 'Drop image here' : 'Upload image to seed generation'}</span>
                      </button>
                    ) : (
                      <div className="relative w-full h-32 bg-slate-900 rounded-xl border border-indigo-500/50 overflow-hidden group">
                        <img 
                          src={seedImage} 
                          alt="Reference" 
                          className="w-full h-full object-contain p-2" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                           <button 
                            type="button"
                            onClick={handleRemoveSeedImage}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors flex items-center gap-2 px-4 shadow-lg"
                          >
                            <X size={16} />
                            <span className="text-xs font-semibold">Remove Image</span>
                          </button>
                        </div>
                        <div className="absolute top-2 left-2 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm pointer-events-none">
                          REF
                        </div>
                      </div>
                    )}
                    <input 
                      ref={fileInputRef} 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileUpload} 
                      accept="image/png, image/jpeg, image/webp"
                    />
                    <p className="text-[10px] text-slate-500">
                      The AI will use this image as inspiration for composition and subject.
                    </p>
                  </div>

                  <div className="space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <label htmlFor="style-instructions" className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                        <MessageSquare size={14} />
                        Customize Style Instructions
                      </label>
                      <span className="text-xs text-slate-500 font-mono">
                        {styleDescription.length}/100
                      </span>
                    </div>
                    <input
                      id="style-instructions"
                      type="text"
                      value={styleDescription}
                      onChange={(e) => setStyleDescription(e.target.value)}
                      placeholder="Customize style instructions..."
                      className="w-full bg-slate-900 border border-indigo-500/30 rounded-lg px-3 py-2 text-xs text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      maxLength={100}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status.isLoading || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  {status.isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Generating Assets...
                    </>
                  ) : (
                    <>
                      <Wand2 size={20} />
                      {seedImage ? 'Generate from Reference' : 'Generate Icon'}
                    </>
                  )}
                </button>
              </form>

              {status.error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 text-red-400 text-sm animate-fade-in">
                  <AlertCircle size={18} />
                  {status.error}
                </div>
              )}
            </div>

            {history.length > 0 && (
              <div className="pt-8 border-t border-slate-800">
                <div className="flex items-center gap-2 mb-4 text-slate-400">
                  <History size={16} />
                  <span className="text-sm font-medium">Recent Generations</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      aria-label={`Load icon: ${item.prompt}`}
                      title={`${item.prompt} (${getStyleDisplayName(item.style)})`}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        generatedIcon?.id === item.id 
                          ? 'border-indigo-500 ring-2 ring-indigo-500/20' 
                          : 'border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <img src={item.imageUrl} alt={item.prompt} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            {generatedIcon ? (
              <div className="space-y-12 animate-fade-in">
                <div className="relative">
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="absolute top-4 right-4 z-20 flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-full text-xs font-semibold backdrop-blur-md transition-all active:scale-95 shadow-lg"
                    >
                      <Edit3 size={14} />
                      Edit Icon
                    </button>
                  )}
                  {isEditing ? (
                    <IconEditor 
                      imageUrl={generatedIcon.imageUrl} 
                      onSave={handleUpdateIcon} 
                      onCancel={() => setIsEditing(false)} 
                    />
                  ) : (
                    <IconPreview icon={generatedIcon} />
                  )}
                </div>
                {!isEditing && <KMPInstructions />}
              </div>
            ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-slate-500 bg-slate-800/30 border border-dashed border-slate-700 rounded-3xl p-8 text-center animate-fade-in">
                 <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Sparkles className="text-slate-600" size={32} />
                 </div>
                 <h3 className="text-xl font-medium text-slate-300 mb-2">Ready to create?</h3>
                 <p className="max-w-md">
                   Enter a prompt or upload a reference image to generate high-quality icons for your next project.
                 </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;