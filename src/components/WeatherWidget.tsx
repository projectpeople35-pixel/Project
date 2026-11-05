import React from 'react';
import { useAgro } from '../context/AppContext';
import { CloudRain, Sun, Cloud, CloudSun, ShieldCheck, Droplet, ArrowRight, Check } from 'lucide-react';
import { WeatherForecastItem } from '../types';

export const mockForecast: WeatherForecastItem[] = [
  { timeLabel: 'Now', temperature: 25, humidity: 62, rainProbability: 15, condition: 'Clear', uvIndex: 6 },
  { timeLabel: '14:00', temperature: 27, humidity: 58, rainProbability: 30, condition: 'Partly Cloudy', uvIndex: 8 },
  { timeLabel: '17:00', temperature: 23, humidity: 74, rainProbability: 75, condition: 'Light Rain', uvIndex: 3 },
  { timeLabel: '20:00', temperature: 20, humidity: 85, rainProbability: 60, condition: 'Overcast', uvIndex: 0 },
];

export const WeatherWidget: React.FC = () => {
  const { controls, updateIrrigationConfig, addAlert } = useAgro();

  const handleToggleRainDelay = () => {
    const nextState = !controls.rainDelayActive;
    updateIrrigationConfig(
      controls.irrigationMode,
      controls.moistureThreshold,
      controls.maxPumpRuntimeSec,
      controls.wateringDurationSec,
      nextState
    );

    addAlert({
      type: 'RAIN_DELAY_ENABLED',
      severity: nextState ? 'INFO' : 'SUCCESS',
      title: nextState ? 'Smart Rain-Delay Activated' : 'Smart Rain-Delay Disengaged',
      message: nextState
        ? 'Forecast predicts 75% precipitation. Automated irrigation runs are paused to prevent waterlogging.'
        : 'Rain-delay suspended. Standard automatic soil moisture schedules resumed.'
    });
  };

  const getWeatherIcon = (cond: WeatherForecastItem['condition']) => {
    switch (cond) {
      case 'Clear':
        return <Sun className="w-5 h-5 text-amber-400" />;
      case 'Partly Cloudy':
        return <CloudSun className="w-5 h-5 text-amber-300" />;
      case 'Light Rain':
      case 'Heavy Rain':
        return <CloudRain className="w-5 h-5 text-blue-400" />;
      default:
        return <Cloud className="w-5 h-5 text-slate-300" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#1b4332] text-white rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-white/10 text-emerald-300">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Microclimate & Rain Radar</h3>
            <p className="text-[11px] text-emerald-200/80">Local Agricultural Weather Node</p>
          </div>
        </div>

        {/* Rain Delay Switch */}
        <button
          onClick={handleToggleRainDelay}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 active:scale-95 border ${
            controls.rainDelayActive
              ? 'bg-blue-500 text-white border-blue-400 shadow-md animate-pulse'
              : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
          }`}
          title="Pause watering when rain is incoming"
        >
          <span className={`w-2 h-2 rounded-full ${controls.rainDelayActive ? 'bg-white' : 'bg-blue-400'}`} />
          <span>{controls.rainDelayActive ? 'Rain Delay Active' : 'Enable Rain Delay'}</span>
        </button>
      </div>

      {/* 4-Period Forecast Strip */}
      <div className="grid grid-cols-4 gap-2 pt-1 text-center font-mono">
        {mockForecast.map((item, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded-2xl border transition ${
              item.rainProbability >= 60
                ? 'bg-blue-950/60 border-blue-500/40'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <span className="text-[10px] text-white/60 font-sans block mb-1">{item.timeLabel}</span>
            <div className="flex justify-center my-1">{getWeatherIcon(item.condition)}</div>
            <span className="text-xs font-bold text-white block">{item.temperature}°C</span>
            <span className="text-[10px] text-blue-300 font-bold block mt-0.5">
              {item.rainProbability}% 🌧️
            </span>
          </div>
        ))}
      </div>

      {/* Beginner Explanation */}
      <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-xs text-white/80 flex items-start space-x-2">
        <Droplet className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Smart Eco-Watering:</strong> Rain anticipated this afternoon (75% probability). Enabling <strong>Smart Rain Delay</strong> holds automated drip cycles, conserving tank water and avoiding soggy root rot.
        </p>
      </div>
    </div>
  );
};
