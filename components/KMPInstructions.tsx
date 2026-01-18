import React from 'react';
import { BookOpen, Code, Smartphone, Terminal, Layers } from 'lucide-react';

export const KMPInstructions: React.FC = () => {
  return (
    <div className="mt-12 space-y-8 animate-fade-in">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <BookOpen className="text-indigo-400" size={24} />
        <h2 className="text-2xl font-bold">Kotlin Multiplatform (KMP) Integration</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Step 1: Compose Multiplatform Resources */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-indigo-300 font-semibold">
            <Layers size={18} />
            <h3>Compose Multiplatform</h3>
          </div>
          <p className="text-sm text-slate-400">The modern way to handle resources in KMP using JetBrain's Compose resources library.</p>
          
          <div className="space-y-3">
            <div className="text-xs font-mono bg-slate-900 p-3 rounded-lg text-slate-300 border border-slate-700">
              <span className="text-slate-500">// 1. Place PNG in</span><br/>
              commonMain/composeResources/drawable/app_icon.png
            </div>
            
            <div className="text-xs font-mono bg-slate-900 p-3 rounded-lg text-slate-300 border border-slate-700">
              <span className="text-slate-500">// 2. Usage in UI</span><br/>
              Icon(<br/>
              &nbsp;&nbsp;painter = painterResource(Res.drawable.app_icon),<br/>
              &nbsp;&nbsp;contentDescription = null<br/>
              )
            </div>
          </div>
        </div>

        {/* Step 2: Platform Specific Icons */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <Smartphone size={18} />
            <h3>App Launcher Icons</h3>
          </div>
          <p className="text-sm text-slate-400">To change the actual icon on the home screen for Android and iOS.</p>
          
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex gap-2">
              <span className="text-slate-500 font-bold">iOS:</span>
              <span>Open <code>iosApp.xcworkspace</code>, go to <code>Assets.xcassets</code>, and drag the <code>.icns</code> or high-res PNG into <code>AppIcon</code>.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-slate-500 font-bold">Android:</span>
              <span>Right-click <code>androidApp/src/main/res</code> &gt; New &gt; Image Asset. Select your 512px PNG as the path.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Pro Tip Box */}
      <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-xl p-4 flex gap-4">
        <div className="bg-indigo-500/20 p-2 rounded-lg h-fit">
          <Terminal size={20} className="text-indigo-400" />
        </div>
        <div>
          <h4 className="text-indigo-300 font-bold text-sm mb-1">Recommended Tool: kmp-notifier</h4>
          <p className="text-xs text-slate-400">
            If you need notifications with these icons in KMP, consider using libraries like <code>kmp-notifier</code>. 
            For launcher icons, always use the <b>Download All (.zip)</b> option to get the correct dimensions for each platform.
          </p>
        </div>
      </div>
    </div>
  );
};
