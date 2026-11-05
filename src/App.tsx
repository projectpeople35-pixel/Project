import React, { useState } from 'react';
import { AppProvider, useAgro } from './context/AppContext';
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { Navigation, ScreenTab } from './components/Navigation';
import { AlertsDrawer } from './components/AlertsDrawer';
import { DashboardScreen } from './screens/DashboardScreen';
import { PlantsScreen } from './screens/PlantsScreen';
import { IrrigationScreen } from './screens/IrrigationScreen';
import { AnalyticsScreen } from './screens/AnalyticsScreen';
import { AssistantScreen } from './screens/AssistantScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AuthScreen } from './screens/AuthScreen';
import { VirtualBreadboard } from './components/VirtualBreadboard';
import { FloraVoiceModal } from './components/FloraVoiceModal';
import { FoundersScreen } from './screens/FoundersScreen';
import { WifiOff, Mic } from 'lucide-react';

const MainShell: React.FC = () => {
  const { user, authLoading, demoMode, setDemoMode } = useAgro();
  const [showSplash, setShowSplash] = useState(true);
  const [currentTab, setCurrentTab] = useState<ScreenTab>('home');
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [floraOpen, setFloraOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // If user is not authenticated and not running demo mode, show Auth Screen
  if (!user && !demoMode && !authLoading) {
    return (
      <AuthScreen
        onBypassDemo={() => {
          setDemoMode(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f9f6] text-slate-800 flex flex-col font-sans relative">
      {/* Network offline toast */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center space-x-1.5 z-50">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Device is currently offline. Operating on cached local telemetry.</span>
        </div>
      )}

      {/* Top App Bar Header */}
      <Header
        onOpenAlerts={() => setAlertsOpen(true)}
        onOpenSettings={() => setCurrentTab('settings')}
        onOpenFlora={() => setFloraOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 overflow-y-auto">
        {currentTab === 'home' && (
          <DashboardScreen
            onNavigateToTab={setCurrentTab}
            onOpenFlora={() => setFloraOpen(true)}
          />
        )}
        {currentTab === 'plants' && <PlantsScreen onNavigateToTab={setCurrentTab} />}
        {currentTab === 'control' && <IrrigationScreen />}
        {currentTab === 'lab' && (
          <div className="p-4 space-y-4 pb-28 max-w-2xl mx-auto">
            <VirtualBreadboard />
          </div>
        )}
        {currentTab === 'analytics' && <AnalyticsScreen />}
        {currentTab === 'assistant' && (
          <AssistantScreen
            onNavigateToTab={setCurrentTab}
            onOpenFlora={() => setFloraOpen(true)}
          />
        )}
        {currentTab === 'settings' && (
          <SettingsScreen
            onLogout={() => {
              setDemoMode(false);
            }}
            onNavigateToTab={setCurrentTab}
          />
        )}
        {currentTab === 'founders' && (
          <FoundersScreen
            onBack={() => setCurrentTab('settings')}
            onNavigateToTab={setCurrentTab}
          />
        )}
      </main>

      {/* Floating Flora AI Voice Summon Button (Global 1-Tap Siri / Alexa Style) */}
      <button
        onClick={() => setFloraOpen(true)}
        className="fixed bottom-20 right-4 z-40 group flex items-center bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 text-slate-950 p-3 sm:px-4 sm:py-3 rounded-full shadow-[0_8px_30px_rgba(16,185,129,0.35)] hover:shadow-[0_8px_35px_rgba(6,182,212,0.5)] border border-emerald-300/40 transition-all duration-200 active:scale-90 hover:scale-105"
        title="Summon Flora Voice Assistant"
        aria-label="Summon Flora AI Assistant"
      >
        <div className="relative flex items-center space-x-1.5">
          <Mic className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          <span className="text-xs font-black tracking-tight text-slate-950 hidden sm:inline">Flora AI</span>
        </div>
      </button>

      {/* Fixed Bottom Tab Navigation */}
      <Navigation currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Slide-up Alerts Center Drawer */}
      <AlertsDrawer
        isOpen={alertsOpen}
        onClose={() => setAlertsOpen(false)}
        onNavigateToTab={setCurrentTab}
      />

      {/* Fullscreen Conversational & Voice AI Assistant Modal */}
      <FloraVoiceModal
        isOpen={floraOpen}
        onClose={() => setFloraOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainShell />
    </AppProvider>
  );
}
