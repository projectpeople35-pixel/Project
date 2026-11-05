import React, { useState } from 'react';
import { useAgro } from '../context/AppContext';
import { InteractiveChart } from '../components/InteractiveChart';
import { HistoricalTelemetryPoint } from '../types';
import {
  BarChart3,
  Droplets,
  Thermometer,
  Wind,
  TestTube,
  Activity,
  Cpu,
  Calendar,
  TrendingUp,
  Download
} from 'lucide-react';

export const AnalyticsScreen: React.FC = () => {
  const {
    historicalData,
    analyticsTimeframe,
    setAnalyticsTimeframe,
    activePlant,
    userProfile
  } = useAgro();

  const [selectedMetric, setSelectedMetric] = useState<
    'soilMoisture' | 'temperature' | 'humidity' | 'soilPH' | 'soilEC' | 'nitrogen' | 'phosphorus' | 'potassium'
  >('soilMoisture');

  // Compute metric stats
  const values = historicalData.map((d) => Number(d[selectedMetric]) || 0);
  const minVal = values.length ? Math.min(...values) : 0;
  const maxVal = values.length ? Math.max(...values) : 0;
  const avgVal = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

  const metricConfigs = {
    soilMoisture: {
      label: 'Soil Moisture',
      unit: '%',
      color: '#10b981',
      gradientId: 'moistGrad',
      minThreshold: activePlant.thresholds.minMoisture,
      maxThreshold: activePlant.thresholds.maxMoisture,
      yMin: 0,
      yMax: 100,
      icon: Droplets
    },
    temperature: {
      label: 'Temperature',
      unit: userProfile.tempUnit === 'F' ? '°F' : '°C',
      color: '#f59e0b',
      gradientId: 'tempGrad',
      minThreshold: activePlant.thresholds.minTemp,
      maxThreshold: activePlant.thresholds.maxTemp,
      yMin: 10,
      yMax: 40,
      icon: Thermometer
    },
    humidity: {
      label: 'Air Humidity',
      unit: '% RH',
      color: '#06b6d4',
      gradientId: 'humGrad',
      minThreshold: 40,
      maxThreshold: 80,
      yMin: 20,
      yMax: 100,
      icon: Wind
    },
    soilPH: {
      label: 'Soil pH',
      unit: 'pH',
      color: '#8b5cf6',
      gradientId: 'phGrad',
      minThreshold: activePlant.thresholds.minPh,
      maxThreshold: activePlant.thresholds.maxPh,
      yMin: 4.5,
      yMax: 8.5,
      icon: TestTube
    },
    soilEC: {
      label: 'Electrical Conductivity',
      unit: 'mS/cm',
      color: '#059669',
      gradientId: 'ecGrad',
      minThreshold: 1.0,
      maxThreshold: 2.8,
      yMin: 0,
      yMax: 4.0,
      icon: Activity
    },
    nitrogen: {
      label: 'Nitrogen (N)',
      unit: 'mg/kg',
      color: '#3b82f6',
      gradientId: 'nGrad',
      minThreshold: activePlant.thresholds.minN || 35,
      maxThreshold: 80,
      yMin: 10,
      yMax: 100,
      icon: Cpu
    },
    phosphorus: {
      label: 'Phosphorus (P)',
      unit: 'mg/kg',
      color: '#ec4899',
      gradientId: 'pGrad',
      minThreshold: activePlant.thresholds.minP || 20,
      maxThreshold: 60,
      yMin: 10,
      yMax: 80,
      icon: Cpu
    },
    potassium: {
      label: 'Potassium (K)',
      unit: 'mg/kg',
      color: '#8b5cf6',
      gradientId: 'kGrad',
      minThreshold: activePlant.thresholds.minK || 120,
      maxThreshold: 250,
      yMin: 50,
      yMax: 300,
      icon: Cpu
    }
  };

  const curr = metricConfigs[selectedMetric];

  // CSV export helper
  const handleExportCSV = () => {
    const headers = 'Timestamp,TimeLabel,SoilMoisture,Temperature,Humidity,SoilPH,SoilEC,N,P,K\n';
    const rows = historicalData
      .map(
        (d) =>
          `${d.timestamp},"${d.timeLabel}",${d.soilMoisture},${d.temperature},${d.humidity},${d.soilPH},${d.soilEC},${d.nitrogen},${d.phosphorus},${d.potassium}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AgroSmart_${selectedMetric}_${analyticsTimeframe}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 space-y-4 pb-28 max-w-2xl mx-auto">
      {/* Timeframe & Export Header */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4 text-slate-400 ml-1 mr-1" />
          <button
            onClick={() => setAnalyticsTimeframe('24h')}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
              analyticsTimeframe === '24h'
                ? 'bg-[#1b4332] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            24 Hours
          </button>
          <button
            onClick={() => setAnalyticsTimeframe('7d')}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
              analyticsTimeframe === '7d'
                ? 'bg-[#1b4332] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setAnalyticsTimeframe('30d')}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
              analyticsTimeframe === '30d'
                ? 'bg-[#1b4332] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            30 Days
          </button>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Metric Selector Chips */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar py-1">
        {(Object.keys(metricConfigs) as (keyof typeof metricConfigs)[]).map((key) => {
          const cfg = metricConfigs[key];
          const isSelected = selectedMetric === key;
          const Icon = cfg.icon;
          return (
            <button
              key={key}
              onClick={() => setSelectedMetric(key)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border active:scale-95 ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cfg.label}</span>
            </button>
          );
        })}
      </div>

      {/* High-Resolution Interactive Telemetry Chart */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
        <InteractiveChart
          data={historicalData}
          metricKey={selectedMetric}
          metricLabel={curr.label}
          metricUnit={curr.unit}
          colorHex={curr.color}
          gradientId={curr.gradientId}
          minThreshold={curr.minThreshold}
          maxThreshold={curr.maxThreshold}
          yMin={curr.yMin}
          yMax={curr.yMax}
        />
      </div>

      {/* Summary Statistics Strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Minimum
          </span>
          <span className="text-base font-black text-slate-900 font-mono mt-1 block">
            {minVal.toFixed(1)} <span className="text-[10px] font-normal text-slate-500">{curr.unit}</span>
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Average
          </span>
          <span className="text-base font-black text-[#1b4332] font-mono mt-1 block">
            {avgVal.toFixed(1)} <span className="text-[10px] font-normal text-slate-500">{curr.unit}</span>
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Maximum
          </span>
          <span className="text-base font-black text-slate-900 font-mono mt-1 block">
            {maxVal.toFixed(1)} <span className="text-[10px] font-normal text-slate-500">{curr.unit}</span>
          </span>
        </div>
      </div>

      {/* Crop Correlation Insights */}
      <div className="bg-emerald-900 text-white rounded-3xl p-5 shadow-md space-y-2">
        <div className="flex items-center space-x-2 text-emerald-300">
          <TrendingUp className="w-4 h-4" />
          <h4 className="text-xs font-bold uppercase tracking-wider">Agronomic Correlation</h4>
        </div>
        <p className="text-xs text-emerald-100/90 leading-relaxed">
          Comparing {curr.label} against transpiration dynamics in <strong>{activePlant.name}</strong>. Notice how root hydration spikes immediately following solenoid valve cycles, followed by steady capillary depletion as canopy temperatures peak at midday.
        </p>
      </div>
    </div>
  );
};
