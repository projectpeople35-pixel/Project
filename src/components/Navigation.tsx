import React from 'react';
import { LayoutDashboard, Sprout, Droplets, Cpu, BarChart3, Bot } from 'lucide-react';
import { useAgro } from '../context/AppContext';

export type ScreenTab = 'home' | 'plants' | 'control' | 'lab' | 'analytics' | 'assistant' | 'settings' | 'founders';

interface NavigationProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab }) => {
  const { t } = useAgro();

  const tabs = [
    { id: 'home' as ScreenTab, label: t('dashboard') || 'Dashboard', icon: LayoutDashboard },
    { id: 'plants' as ScreenTab, label: t('plants') || 'Plants', icon: Sprout },
    { id: 'control' as ScreenTab, label: t('irrigation') || 'Irrigation', icon: Droplets },
    { id: 'lab' as ScreenTab, label: t('iotLab') || 'IoT Lab', icon: Cpu },
    { id: 'analytics' as ScreenTab, label: t('analytics') || 'Analytics', icon: BarChart3 },
    { id: 'assistant' as ScreenTab, label: t('advisor') || 'Advisor', icon: Bot },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-safe">
      <div className="max-w-2xl mx-auto px-2">
        <div className="grid grid-cols-6 items-center h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center h-full min-h-[48px] min-w-[48px] rounded-xl transition-all duration-150 active:scale-90 ${
                  isActive ? 'text-[#1b4332] font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isActive ? 'bg-emerald-100/70 text-[#1b4332]' : 'bg-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                </div>
                <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-[#1b4332]' : 'font-medium'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
