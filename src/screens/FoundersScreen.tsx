import React from 'react';
import {
  Heart,
  Sprout,
  ShieldCheck,
  Compass,
  Sparkles,
  Users,
  Feather,
  Cpu,
  Droplets,
  Globe,
  Award,
  ArrowLeft
} from 'lucide-react';

interface Founder {
  name: string;
  role: string;
  specialization: string;
  bio: string;
  initials: string;
  accent: string;
}

const foundersList: Founder[] = [
  {
    name: 'Ayush Gautam',
    role: 'Co-Founder & Systems Architect',
    specialization: 'IoT Hardware Engineering & High-Precision Sensing',
    bio: 'Dedicated to bridging low-power embedded microcontrollers with resilient analog sensor buses to bring lab-grade soil science to every field.',
    initials: 'AG',
    accent: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  {
    name: 'Ranvijay',
    role: 'Co-Founder & Agronomic Intelligence Lead',
    specialization: 'Soil Chemistry, VPD & Nutrient Hydrodynamics',
    bio: 'Passionate about translating physiological plant stress indicators into real-time algorithms that preserve water while maximizing organic crop vitality.',
    initials: 'RV',
    accent: 'bg-teal-100 text-teal-800 border-teal-300'
  },
  {
    name: 'Rishabh',
    role: 'Co-Founder & Principal Embedded Engineer',
    specialization: 'ESP32 Firmware Architecture & Fail-Safe Actuation',
    bio: 'Architect of AgroSmart’s two-phase hardware handshake and emergency cutoffs, ensuring automated irrigation lines never fail or flood.',
    initials: 'RS',
    accent: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  {
    name: 'Jagrav',
    role: 'Co-Founder & Design Director',
    specialization: 'Human-Centered UI/UX & Mobile Accessibility',
    bio: 'Crafts welcoming, high-tech touch interfaces that demystify complex agricultural telemetry so first-time hobbyists feel like master horticulturists.',
    initials: 'JG',
    accent: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  {
    name: 'Aayush Chaubey',
    role: 'Co-Founder & Cloud Systems Lead',
    specialization: 'Distributed Realtime Telemetry & Edge Security',
    bio: 'Spearheads encrypted Firebase data pipelines and microclimate weather integrations to deliver instantaneous telemetry across devices globally.',
    initials: 'AC',
    accent: 'bg-purple-100 text-purple-800 border-purple-300'
  }
];

export interface FoundersScreenProps {
  onBack?: () => void;
  onNavigateToTab?: (tab: any) => void;
}

export const FoundersScreen: React.FC<FoundersScreenProps> = ({ onBack, onNavigateToTab }) => {
  return (
    <div className="p-4 space-y-5 pb-28 max-w-2xl mx-auto">
      {/* Back button if opened from settings/other screen */}
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#1b4332] bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200/60 transition active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return</span>
        </button>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#1b4332] via-[#245840] to-[#2d6a4f] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-mono mb-3 border border-white/15">
          <Users className="w-3.5 h-3.5 text-amber-300" />
          <span>The Visionaries Behind AgroSmart</span>
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight">
          Founders & Perspective
        </h2>
        <p className="text-xs text-emerald-100/90 mt-1.5 leading-relaxed max-w-lg">
          Meet the team uniting embedded electronics, data science, and environmental ethics to make sustainable precision agriculture intuitive and accessible for all.
        </p>
      </div>

      {/* Morality and Our Perspective Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center space-x-2 text-[#1b4332]">
          <Compass className="w-5 h-5 text-emerald-700" />
          <h3 className="text-sm font-extrabold tracking-wider uppercase">
            Morality & Our Perspective
          </h3>
        </div>

        {/* Featured Philosophy Blockquote */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-5 rounded-2xl border border-emerald-200/80 relative">
          <div className="text-3xl text-emerald-600/30 font-serif absolute top-2 left-3 select-none">“</div>
          <p className="text-xs sm:text-sm text-slate-800 italic font-medium leading-relaxed pl-4">
            At AgroSmart, our morality is grounded in the sacred contract between humanity and the living earth. We believe technology should never exploit nature, but listen to it. Every drop of water conserved, every soil microbiome nurtured, and every aspiring grower empowered is an act of ecological devotion.
          </p>
        </div>

        {/* 4 Pillars of AgroSmart's Perspective */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>Reverence for Living Soil</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Soil is not inert dirt; it is a complex, breathing microbiological cosmos. Our sensors are built to observe its natural rhythm without disturbing rhizosphere balance.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
              <Droplets className="w-4 h-4 text-blue-600" />
              <span>Stewardship Over Scarcity</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Freshwater is our planet’s most precious endowment. Closed-loop automated micro-dosing ensures plants receive exact hydration, preventing a single liter from being wasted.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
              <Cpu className="w-4 h-4 text-teal-600" />
              <span>Democratic, Open Silicon</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              We reject corporate walled gardens. By building on open ESP32 hardware and transparent firmware, we place the power of agricultural automation directly in people’s hands.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Empathy for the Beginner</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Science should never intimidate. We translate electrical conductivity and chemical formulas into encouraging, actionable language so every newbie can cultivate with confidence.
            </p>
          </div>
        </div>
      </div>

      {/* The Founders Roster */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Founding Leadership Team
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">5 Visionaries</span>
        </div>

        <div className="space-y-3">
          {foundersList.map((founder, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start space-x-3.5 min-w-0">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-sm border shrink-0 ${founder.accent}`}
                >
                  {founder.initials}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-extrabold text-slate-900 truncate">
                      {founder.name}
                    </h4>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                      Co-Founder
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-[#1b4332] mt-0.5">
                    {founder.role}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {founder.specialization}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    {founder.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inspirational Closing Sign-off */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 text-center space-y-2 shadow-lg">
        <Sparkles className="w-6 h-6 text-emerald-400 mx-auto" />
        <h4 className="text-sm font-extrabold text-white">Built with Dedication for Our Planet</h4>
        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
          From Ayush Gautam, Ranvijay, Rishabh, Jagrav, and Aayush Chaubey — thank you for growing with AgroSmart.
        </p>
        <p className="text-xs text-emerald-400 font-mono font-bold tracking-widest uppercase pt-1">
          "Grow Smarter, Live Greener."
        </p>
      </div>
    </div>
  );
};
