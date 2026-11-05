import React, { useState, useMemo } from 'react';
import { useAgro } from '../context/AppContext';
import { Wind, Thermometer, Info, HelpCircle, CheckCircle2, AlertTriangle, Sliders } from 'lucide-react';

export function calculateVpd(tempC: number, rhPercent: number) {
  // Tetens equation for saturated vapor pressure (kPa)
  const vpsat = 0.61078 * Math.exp((17.27 * tempC) / (tempC + 237.3));
  // Actual vapor pressure in air
  const vpact = vpsat * (rhPercent / 100);
  // VPD in kPa
  const vpd = Math.max(0, vpsat - vpact);

  let status: 'UNDER_TRANSPIRING' | 'SWEET_SPOT' | 'HIGH_TRANSPIRATION_STRESS' = 'SWEET_SPOT';
  let advice = '';

  if (vpd < 0.6) {
    status = 'UNDER_TRANSPIRING';
    advice = 'Air is saturated with moisture. Plant cannot transpire or pull calcium upward. Risk of fungus.';
  } else if (vpd <= 1.3) {
    status = 'SWEET_SPOT';
    advice = 'Ideal commercial greenhouse transpiration sweet spot! Nutrients flow freely into leaves and fruit.';
  } else {
    status = 'HIGH_TRANSPIRATION_STRESS';
    advice = 'Air is excessively dry. Plant is transpiring too fast and may close stomata to prevent desiccation.';
  }

  return {
    vpdKPa: Number(vpd.toFixed(2)),
    status,
    vpsat: Number(vpsat.toFixed(2)),
    vpact: Number(vpact.toFixed(2)),
    advice
  };
}

export const VpdCalculator: React.FC = () => {
  const { sensors, userProfile } = useAgro();
  const [useCustomSliders, setUseCustomSliders] = useState(false);
  const [customTemp, setCustomTemp] = useState(sensors.temperature);
  const [customRh, setCustomRh] = useState(sensors.humidity);

  const activeTemp = useCustomSliders ? customTemp : sensors.temperature;
  const activeRh = useCustomSliders ? customRh : sensors.humidity;

  const result = useMemo(() => calculateVpd(activeTemp, activeRh), [activeTemp, activeRh]);

  const vpdScore = Math.min(2.5, Math.max(0, result.vpdKPa));
  const pointerPercent = (vpdScore / 2.5) * 100;

  const statusBadge =
    result.status === 'SWEET_SPOT'
      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
      : result.status === 'UNDER_TRANSPIRING'
      ? 'bg-blue-100 text-blue-800 border-blue-300'
      : 'bg-rose-100 text-rose-800 border-rose-300';

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Vapor Pressure Deficit (VPD)</h3>
            <p className="text-[11px] text-slate-400">Canopy Transpiration & Humidity Pressure</p>
          </div>
        </div>

        <button
          onClick={() => setUseCustomSliders(!useCustomSliders)}
          className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition border flex items-center space-x-1 ${
            useCustomSliders
              ? 'bg-[#1b4332] text-white border-[#1b4332]'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-3 h-3" />
          <span>{useCustomSliders ? 'Custom Sim' : 'Live DHT22'}</span>
        </button>
      </div>

      {/* Main VPD Gauge Readout */}
      <div className="flex items-baseline justify-between pt-1">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
            VPD Atmospheric Drying Power
          </span>
          <div className="flex items-baseline space-x-1.5 mt-0.5">
            <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
              {result.vpdKPa}
            </span>
            <span className="text-xs font-bold text-slate-500">kPa</span>
          </div>
        </div>

        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusBadge}`}>
          {result.status === 'SWEET_SPOT'
            ? 'Optimal Sweet Spot'
            : result.status === 'UNDER_TRANSPIRING'
            ? 'Under-Transpiring'
            : 'Transpiration Stress'}
        </span>
      </div>

      {/* Visual Transpiration Bar */}
      <div>
        <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div className="w-[24%] bg-blue-400" title="Low / Guttation (<0.6 kPa)" />
          <div className="w-[36%] bg-emerald-500" title="Sweet Spot (0.6 - 1.3 kPa)" />
          <div className="w-[40%] bg-rose-400" title="Dry stress (>1.3 kPa)" />
        </div>

        {/* Pointer Triangle */}
        <div className="relative h-2 w-full">
          <div
            className="absolute top-0 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-slate-800 transition-all duration-300"
            style={{ left: `${Math.min(96, Math.max(4, pointerPercent))}%` }}
          />
        </div>

        <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
          <span>0.0 kPa (Cold/Wet)</span>
          <span className="text-emerald-700 font-bold">0.8 - 1.2 kPa Target</span>
          <span>2.5+ kPa (Hot/Dry)</span>
        </div>
      </div>

      {/* Plain English Newbie Explanation */}
      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
        <div className="flex items-center space-x-1 text-slate-800 font-bold">
          <Info className="w-3.5 h-3.5 text-teal-600" />
          <span>Why VPD Matters for Beginners:</span>
        </div>
        <p className="leading-relaxed text-[11px] text-slate-600">
          {result.advice}
        </p>
      </div>

      {/* Interactive Simulation Sliders if enabled */}
      {useCustomSliders && (
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-600">Simulated Temperature</span>
              <span className="text-slate-900 font-mono font-bold">{customTemp.toFixed(1)}°C</span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              step="0.5"
              value={customTemp}
              onChange={(e) => setCustomTemp(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-600">Simulated Relative Humidity</span>
              <span className="text-slate-900 font-mono font-bold">{customRh.toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="95"
              step="1"
              value={customRh}
              onChange={(e) => setCustomRh(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
