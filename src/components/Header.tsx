import React, { useState } from 'react';
import { useAgro } from '../context/AppContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Bell,
  Wifi,
  Download,
  Sparkles,
  Volume2,
  Settings,
  HelpCircle,
  Check,
  Mic,
  Languages
} from 'lucide-react';
import { getLanguage } from '../services/languages';

interface HeaderProps {
  onOpenAlerts: () => void;
  onOpenSettings: () => void;
  onOpenFlora?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAlerts, onOpenSettings, onOpenFlora }) => {
  const {
    demoMode,
    setDemoMode,
    deviceStatus,
    unreadAlertCount,
    selectedDeviceId,
    userProfile,
    toggleNewbieMode,
    speakStatusBriefing
  } = useAgro();

  const { isInstallable, isInstalled, install, isIOS } = usePWAInstall();
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const activeLang = React.useMemo(() => getLanguage(userProfile.language), [userProfile.language]);

  const handleVoiceBriefing = () => {
    setIsSpeaking(true);
    speakStatusBriefing();
    setTimeout(() => setIsSpeaking(false), 4500);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#1b4332] text-white shadow-md border-b border-[#2d6a4f]/40 pt-safe">
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
          {/* Brand Wordmark & Logo */}
          <div className="flex items-center space-x-2.5 min-w-0">
            <img
              src="/src/assets/images/agrosmart_brand_logo_1793772055945.jpg"
              alt="AgroSmart Logo"
              className="w-8 h-8 rounded-xl object-cover ring-1 ring-emerald-400/30 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white truncate">AgroSmart</span>
                <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.2 bg-emerald-900/80 text-emerald-300 rounded border border-emerald-600/30">
                  IoT
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-[11px] text-emerald-200/90 truncate font-mono">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="truncate">{selectedDeviceId}</span>
                <span className="text-emerald-400/60">·</span>
                <span className={deviceStatus.online ? 'text-emerald-300' : 'text-rose-300'}>
                  {deviceStatus.online ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-1.5 shrink-0">
            {/* Plain English Newbie Mode Toggle */}
            <button
              onClick={toggleNewbieMode}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition active:scale-95 border ${
                userProfile.newbieMode
                  ? 'bg-amber-400 text-amber-950 border-amber-300 shadow-sm'
                  : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
              }`}
              title="Toggle beginner plain-English explanations"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-900" />
              <span>{userProfile.newbieMode ? 'Newbie: ON' : 'Newbie'}</span>
            </button>

            {/* Audio Voice Briefing */}
            <button
              onClick={handleVoiceBriefing}
              className={`p-2 rounded-xl border transition active:scale-95 ${
                isSpeaking
                  ? 'bg-emerald-400 text-emerald-950 border-emerald-300 animate-pulse'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
              title="Audible Plant Status Briefing"
              aria-label="Speak plant status briefing"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>

            {/* Flora AI Voice Summon */}
            {onOpenFlora && (
              <button
                onClick={onOpenFlora}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/25 to-cyan-500/25 hover:from-emerald-500/35 hover:to-cyan-500/35 text-cyan-200 border border-cyan-400/40 transition active:scale-95"
                title="Talk with Flora Voice Assistant"
                aria-label="Talk with Flora Voice Assistant"
              >
                <Mic className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                <span className="text-[11px] font-bold">Flora</span>
              </button>
            )}

            {/* PWA In-App Install Button */}
            {isInstallable && !isInstalled && (
              <button
                onClick={install}
                className="flex items-center space-x-1 bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl border border-emerald-500/40 transition active:scale-95"
                title="Install AgroSmart App on Device"
              >
                <Download className="w-3.5 h-3.5 text-emerald-200" />
                <span className="hidden sm:inline">Install</span>
              </button>
            )}

            {/* Mode Switcher */}
            <button
              onClick={() => setDemoMode(!demoMode)}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition active:scale-95 border ${
                demoMode
                  ? 'bg-amber-400/20 text-amber-200 border-amber-400/50 hover:bg-amber-400/30'
                  : 'bg-emerald-600/50 text-emerald-100 border-emerald-400/30 hover:bg-emerald-600'
              }`}
              title="Toggle between Simulation and Live ESP32 connection"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${demoMode ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
              <span className="hidden sm:inline">{demoMode ? 'Simulation' : 'Live'}</span>
            </button>

            {/* Notification Bell with Badge */}
            <button
              onClick={onOpenAlerts}
              className="relative p-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-100 border border-emerald-600/30 transition active:scale-95"
              aria-label="View system alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#1b4332] animate-bounce">
                  {unreadAlertCount}
                </span>
              )}
            </button>

            {/* Quick Settings Gear */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition active:scale-95"
              aria-label="Open System Settings"
              title="Open System Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* iOS PWA Install Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 max-w-sm w-full rounded-2xl p-5 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">Install AgroSmart on iOS</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              1. Tap the <strong className="text-slate-900">Share</strong> icon at the bottom of your Safari browser.<br />
              2. Scroll down and select <strong className="text-slate-900">Add to Home Screen</strong>.<br />
              3. Launch AgroSmart directly from your home screen for full offline and fullscreen support.
            </p>
            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full bg-[#1b4332] text-white py-2.5 rounded-xl text-xs font-bold transition hover:bg-[#2d6a4f]"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
};
