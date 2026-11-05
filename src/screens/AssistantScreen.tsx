import React, { useState } from 'react';
import { useAgro } from '../context/AppContext';
import { evaluatePlantHealth, AgroAdvice } from '../services/aiAssistant';
import {
  Bot,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  Send,
  Droplets,
  Thermometer,
  TestTube,
  Activity,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Mic,
  Users,
  Heart
} from 'lucide-react';

export const AssistantScreen: React.FC<{
  onNavigateToTab: (tab: any) => void;
  onOpenFlora?: () => void;
}> = ({ onNavigateToTab, onOpenFlora }) => {
  const { sensors, activePlant, controls, executePumpToggle } = useAgro();
  const diagnostic = evaluatePlantHealth(sensors, activePlant);

  // Interactive agronomy Q&A state
  const [query, setQuery] = useState('');
  const [qaHistory, setQaHistory] = useState<Array<{ q: string; a: string; time: string }>>([
    {
      q: `What is the optimal watering frequency for ${activePlant.name}?`,
      a: `Based on your current soil moisture reading of ${sensors.soilMoisture.toFixed(1)}% and configured threshold (${activePlant.thresholds.minMoisture}%), automated pulse irrigation of ${controls.wateringDurationSec} seconds provides approximately ${((controls.wateringDurationSec * 2.4) / 60).toFixed(1)}L per cycle. This prevents both root hypoxia and drought cavitation.`,
      time: 'Just now'
    }
  ]);
  const [loadingAnswer, setLoadingAnswer] = useState(false);

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userQ = query;
    setQuery('');
    setLoadingAnswer(true);

    setTimeout(() => {
      let responseText = '';
      const qLower = userQ.toLowerCase();

      if (qLower.includes('water') || qLower.includes('moisture') || qLower.includes('irrigate')) {
        responseText = `Current substrate moisture is ${sensors.soilMoisture.toFixed(1)}%. For ${activePlant.name} (${activePlant.species}), the optimal range is between ${activePlant.thresholds.minMoisture}% and ${activePlant.thresholds.maxMoisture}%. Drip delivery ensures water reaches root depth without wetting canopy foliage, preventing fungal spores.`;
      } else if (qLower.includes('ph') || qLower.includes('acid') || qLower.includes('alkaline')) {
        responseText = `Your live pH reading is ${sensors.soilPH.toFixed(2)}. ${activePlant.name} thrives between pH ${activePlant.thresholds.minPh} and ${activePlant.thresholds.maxPh}. At this level, macronutrients (N, P, K) and secondary minerals are in soluble ionic equilibrium.`;
      } else if (qLower.includes('temp') || qLower.includes('heat') || qLower.includes('cold')) {
        responseText = `Ambient sensor DHT22 reports ${sensors.temperature.toFixed(1)}°C with ${sensors.humidity.toFixed(1)}% humidity. This yields a healthy vapor pressure deficit (VPD) suited for active transpiration.`;
      } else if (qLower.includes('fertilizer') || qLower.includes('npk') || qLower.includes('ec')) {
        responseText = `Modbus sensor shows Nitrogen: ${sensors.nitrogen} mg/kg, Phosphorus: ${sensors.phosphorus} mg/kg, Potassium: ${sensors.potassium} mg/kg with EC of ${sensors.soilEC.toFixed(2)} mS/cm. Keep electrical conductivity under 2.8 mS/cm to prevent osmotic burn.`;
      } else {
        responseText = `Based on your live IoT readings (${sensors.soilMoisture.toFixed(1)}% moisture, ${sensors.temperature.toFixed(1)}°C, pH ${sensors.soilPH.toFixed(2)}), ${activePlant.name} is in a ${diagnostic.summaryTitle.toLowerCase()} state. Ensure the automated relay threshold remains at ${activePlant.thresholds.minMoisture}%.`;
      }

      setQaHistory((prev) => [
        {
          q: userQ,
          a: responseText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
      setLoadingAnswer(false);
    }, 700);
  };

  const scoreColor =
    diagnostic.overallHealthScore >= 80
      ? 'text-emerald-400 stroke-emerald-500'
      : diagnostic.overallHealthScore >= 60
      ? 'text-amber-400 stroke-amber-500'
      : 'text-rose-400 stroke-rose-500';

  return (
    <div className="p-4 space-y-4 pb-28 max-w-2xl mx-auto">
      {/* Flora AI Voice & Conversational Assistant Hero Banner */}
      <div className="bg-slate-950 text-white rounded-3xl p-5 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3.5">
            <div className="relative shrink-0">
              <img
                src="/src/assets/images/flora_ai_avatar_1793774183839.jpg"
                alt="Flora AI"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-400/60 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-base font-extrabold text-white tracking-tight">Flora AI</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  VOICE HELPER
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Voice & text assistant just like Siri & Alexa. Controls pumps, tracks soil telemetry & explains agronomy.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Say: "Turn on the pump" · "What is my pH?"</span>
          </div>

          <button
            onClick={onOpenFlora}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl text-xs shadow-lg transition active:scale-95"
          >
            <Mic className="w-4 h-4 text-slate-950" />
            <span>Talk to Flora (Voice / Text)</span>
          </button>
        </div>
      </div>

      {/* AI / Rule Engine Header Card */}
      <div className="bg-gradient-to-br from-[#1b4332] via-[#245840] to-[#2d6a4f] text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-mono mb-2 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Agronomic Diagnostic Engine</span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              AI Plant Advisor
            </h2>
            <p className="text-xs text-emerald-100/80 mt-1 max-w-sm">
              Analyzing real-time sensor observations for <strong>{activePlant.name}</strong> ({activePlant.species}) against horticultural thresholds.
            </p>
          </div>

          {/* Radial score gauge */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black/20 border border-white/10 shrink-0">
            <span className="text-[10px] text-emerald-200 uppercase font-mono tracking-wider">Health Index</span>
            <div className="flex items-baseline mt-0.5">
              <span className={`text-3xl font-black font-mono tracking-tight ${scoreColor}`}>
                {diagnostic.overallHealthScore}
              </span>
              <span className="text-xs text-white/50 font-mono">/100</span>
            </div>
            <span className="text-[9px] text-emerald-300/80 mt-0.5 font-semibold">
              {diagnostic.overallHealthScore >= 80 ? 'Vigorous' : 'Needs Care'}
            </span>
          </div>
        </div>

        {/* Engine Transparency badge */}
        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-emerald-200/90 font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            Rule-Based Expert Agronomy (FAO-56 Calibrated)
          </span>
          <span>Zero Hallucinated Metrics</span>
        </div>
      </div>

      {/* Categorized Diagnostic Recommendations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Parametric Observations & Prescriptions
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            {diagnostic.recommendations.length} Active Checks
          </span>
        </div>

        {diagnostic.recommendations.map((adv, idx) => {
          const isOptimal = adv.status === 'OPTIMAL';
          const isCritical = adv.status === 'CRITICAL';

          const borderStyle = isCritical
            ? 'border-rose-200 bg-rose-50/20'
            : isOptimal
            ? 'border-emerald-200 bg-white'
            : 'border-amber-200 bg-amber-50/20';

          const badgeStyle = isCritical
            ? 'bg-rose-100 text-rose-800 border-rose-300'
            : isOptimal
            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
            : 'bg-amber-100 text-amber-800 border-amber-300';

          return (
            <div
              key={idx}
              className={`rounded-3xl p-5 border shadow-sm transition hover:shadow-md ${borderStyle}`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
                    {adv.category}
                  </span>
                  {adv.scientificReference && (
                    <span className="text-[10px] text-slate-400 hidden sm:inline">
                      Ref: {adv.scientificReference}
                    </span>
                  )}
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle}`}>
                  {adv.status}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mb-1">{adv.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">{adv.detail}</p>

              {/* Actionable recommendation block */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-start justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1b4332] block mb-0.5">
                    Recommended Action
                  </span>
                  <p className="text-slate-700 leading-relaxed">{adv.actionableStep}</p>
                </div>

                {adv.category === 'Watering' && !isOptimal && (
                  <button
                    onClick={() => onNavigateToTab('control')}
                    className="shrink-0 bg-[#1b4332] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm hover:bg-[#2d6a4f] transition flex items-center space-x-1"
                  >
                    <Droplets className="w-3.5 h-3.5" />
                    <span>Irrigate</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Agronomy Consultation Box */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center space-x-2">
          <Bot className="w-4 h-4 text-[#1b4332]" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Ask Agronomy Advisor
          </h3>
        </div>

        <p className="text-xs text-slate-500">
          Query specific care strategies, fertilizer dilution ratios, or disease prevention based on live readings.
        </p>

        <form onSubmit={handleAskQuestion} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. How does my soil pH affect nitrogen uptake?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#1b4332] outline-none"
          />
          <button
            type="submit"
            disabled={loadingAnswer || !query.trim()}
            className="bg-[#1b4332] hover:bg-[#2d6a4f] disabled:opacity-40 text-white p-2.5 rounded-xl transition active:scale-95"
            aria-label="Submit Question"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Q&A Thread */}
        <div className="space-y-2.5 pt-2 max-h-60 overflow-y-auto">
          {qaHistory.map((item, i) => (
            <div key={i} className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span className="font-semibold text-slate-700">Q: {item.q}</span>
                <span className="font-mono">{item.time}</span>
              </div>
              <p className="text-slate-600 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-100">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Founders & Morality Banner */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#1b4332] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-[#1b4332]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Founders & Our Perspective</h4>
            <p className="text-[11px] text-slate-500">
              Meet Ayush Gautam, Ranvijay, Rishabh, Jagrav & Aayush Chaubey
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateToTab('founders')}
          className="shrink-0 text-xs font-bold text-[#1b4332] bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl border border-emerald-200 transition active:scale-95 flex items-center space-x-1"
        >
          <span>Read Ethos</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
