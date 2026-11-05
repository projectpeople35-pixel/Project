import React, { useState } from 'react';
import { useAgro } from '../context/AppContext';
import { Droplet, AlertTriangle, ShieldCheck, RefreshCw, Gauge, Waves } from 'lucide-react';

export const TankSentry: React.FC = () => {
  const { controls, executeEmergencyHalt, addAlert } = useAgro();
  const [tankLiters, setTankLiters] = useState(16.5);
  const maxCapacity = 20.0;

  const percentage = Math.round((tankLiters / maxCapacity) * 100);
  const isLow = percentage <= 15;
  const flowRate = controls.pumpActual ? 2.4 : 0.0;

  const handleRefill = () => {
    setTankLiters(maxCapacity);
    addAlert({
      type: 'LOW_WATER_RESERVOIR',
      severity: 'SUCCESS',
      title: 'Water Reservoir Replenished',
      message: `Tank refilled to 100% capacity (${maxCapacity} Litres). Pump lines primed.`
    });
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Reservoir & Flow Telemetry</h3>
            <p className="text-[11px] text-slate-400">Ultrasonic Tank Level & Hall Flow Meter</p>
          </div>
        </div>

        <button
          onClick={handleRefill}
          className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition active:scale-95 flex items-center space-x-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refill Tank</span>
        </button>
      </div>

      {/* Main Level & Flow Split */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Tank Level Display */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              Reservoir Volume
            </span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                {tankLiters.toFixed(1)}
              </span>
              <span className="text-xs font-bold text-slate-500">/ {maxCapacity} L</span>
            </div>
          </div>

          {/* Liquid level fill bar */}
          <div className="mt-3">
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isLow ? 'bg-rose-500' : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>{percentage}% Full</span>
              <span className={isLow ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                {isLow ? 'Low Water Level' : 'Adequate'}
              </span>
            </div>
          </div>
        </div>

        {/* Realtime Flow Rate */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              Line Flow Rate
            </span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className={`text-2xl font-black font-mono tracking-tight ${controls.pumpActual ? 'text-emerald-600' : 'text-slate-800'}`}>
                {flowRate.toFixed(1)}
              </span>
              <span className="text-xs font-bold text-slate-500">L/min</span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 flex items-center justify-between font-mono">
            <span>Solenoid Valve:</span>
            <span className={`font-bold ${controls.pumpActual ? 'text-emerald-700' : 'text-slate-600'}`}>
              {controls.pumpActual ? 'Open (Flowing)' : 'Closed'}
            </span>
          </div>
        </div>
      </div>

      {isLow && (
        <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>
            <strong>Dry-Run Safety Lockout:</strong> Water level is below 15%. Refill reservoir to protect pump impeller from overheating.
          </span>
        </div>
      )}
    </div>
  );
};
