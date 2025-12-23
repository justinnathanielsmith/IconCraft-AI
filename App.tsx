import React, { useState } from 'react';
import { Loader2, Wand2, Sparkles, AlertCircle, History } from 'lucide-react';
import { IconStyle, GeneratedIcon, GenerationState } from './types';
import { generateAppIcon } from './services/geminiService';
import { IconPreview } from './components/IconPreview';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<IconStyle>(IconStyle.MINIMALIST);
  const [generatedIcon, setGeneratedIcon] = useState<GeneratedIcon | null>(null);
  const [status, setStatus] = useState<GenerationState>({ isLoading: false, error: null });
  const [history, setHistory] = useState<GeneratedIcon[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setStatus({ isLoading: true, error: null });

    try {
      const base64Image = await generateAppIcon(prompt, selectedStyle);
      const newIcon: GeneratedIcon = {
        id: crypto.randomUUID(),
        imageUrl: base64Image,
        prompt,
        style: selectedStyle,
        createdAt: Date.now(),
      };

      setGeneratedIcon(newIcon);
      setHistory(prev => [newIcon, ...prev].slice(0, 5)); // Keep last 5
    } catch (error) {
      setStatus({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to generate icon" 
      });
    } finally {
      setStatus(prev => ({ ...prev, isLoading: false }));
    }
  };

  const loadFromHistory = (icon: GeneratedIcon) => {
    setGeneratedIcon(icon);
    setPrompt(icon.prompt);
    setSelectedStyle(icon.style);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 pb-20">
      {/* Header */}
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
          <div className="text-xs text-slate-500 font-mono border border-slate-800 rounded-full px-3 py-1">
            Powered by Gemini
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold leading-tight">
                Design stunning app icons <br />
                <span className="text-indigo-400">in seconds.</span>
              </h2>
              <p className="text-slate-400">
                Describe your app and let AI create professional assets for Android and iOS.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  What is your app about?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. A fast rocket delivery service, red and white theme..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none h-32"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Choose a style
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.values(IconStyle) as IconStyle[]).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setSelectedStyle(style)}
                      className={`text-left text-xs p-3 rounded-lg border transition-all ${
                        selectedStyle === style
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {style.split(',')[0]}
                    </button>
                  ))}
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
                    Generate Icon
                  </>
                )}
              </button>

              {status.error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 text-red-400 text-sm">
                  <AlertCircle size={18} />
                  {status.error}
                </div>
              )}
            </form>

            {/* History Section */}
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
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        generatedIcon?.id === item.id 
                          ? 'border-indigo-500 ring-2 ring-indigo-500/20' 
                          : 'border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <img src={item.imageUrl} alt="History" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Preview Area */}
          <div className="lg:col-span-7">
            {generatedIcon ? (
              <IconPreview icon={generatedIcon} />
            ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-slate-500 bg-slate-800/30 border border-dashed border-slate-700 rounded-3xl p-8 text-center">
                 <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="text-slate-600" size={32} />
                 </div>
                 <h3 className="text-xl font-medium text-slate-300 mb-2">Ready to create?</h3>
                 <p className="max-w-md">
                   Enter a prompt and select a style to generate high-quality icons for your next project.
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