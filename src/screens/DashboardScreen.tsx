import React, { useState } from 'react';
import { useAgro } from '../context/AppContext';
import { WeatherWidget } from '../components/WeatherWidget';
import { VpdCalculator } from '../components/VpdCalculator';
import {
  Droplets,
  Thermometer,
  Wind,
  TestTube,
  Activity,
  Cpu,
  Wifi,
  Clock,
  ShieldCheck,
  RefreshCw,
  Sprout,
  ArrowRight,
  ChevronRight,
  HelpCircle,
  Sparkles,
  Zap,
  Volume2,
  Mic
} from 'lucide-react';

interface SensorCardProps {
  title: string;
  subtitle: string;
  value: string | number;
  unit: string;
  status: 'NORMAL' | 'LOW' | 'HIGH';
  icon: React.ReactNode;
  timeStr: string;
  targetRange?: string;
  accentBg: string;
  accentText: string;
  percentage?: number; // 0 - 100 for circular dial
  newbieExplanation: string;
  isNewbieMode: boolean;
  onClickConfigure?: () => void;
}

const SensorCard: React.FC<SensorCardProps> = ({
  title,
  subtitle,
  value,
  unit,
  status,
  icon,
  timeStr,
  targetRange,
  accentBg,
  accentText,
  percentage = 50,
  newbieExplanation,
  isNewbieMode,
  onClickConfigure
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'LOW':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'HIGH':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  // Radial dial calculation
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-2xl ${accentBg} ${accentText}`}>
              {icon}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 leading-tight">{title}</h4>
              <p className="text-[10px] text-slate-400 font-mono">{subtitle}</p>
            </div>
          </div>

          {/* Radial progress ring dial */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-10 h-10 -rotate-90">
              <circle
                cx="20"
                cy="20"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="3.5"
                fill="none"
              />
              <circle
                cx="20"
                cy="20"
                r={radius}
                className={`${accentText} transition-all duration-500`}
                strokeWidth="3.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="absolute text-[9px] font-mono font-black text-slate-700">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>

        <div className="mt-2 mb-1">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-slate-900 tracking-tight font-mono tabular-nums">
              {value}
            </span>
            <span className="text-xs font-semibold text-slate-500">{unit}</span>
          </div>

          <div className="flex items-center justify-between mt-1">
            {targetRange && (
              <p className="text-[11px] text-slate-400 font-medium">
                Target: <span className="text-slate-600 font-semibold">{targetRange}</span>
              </p>
            )}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge()}`}>
              {status}
            </span>
          </div>
        </div>

        {/* Newbie Plain English Explanation Banner */}
        {isNewbieMode && (
          <div className="mt-2.5 p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-950 flex items-start space-x-2 leading-relaxed">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span>{newbieExplanation}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
        <span className="flex items-center">
          <Clock className="w-3 h-3 mr-1 text-slate-400" />
          {timeStr}
        </span>
        {onClickConfigure && (
          <button
            onClick={onClickConfigure}
            className="text-[#1b4332] hover:underline font-semibold font-sans flex items-center"
          >
            Adjust
          </button>
        )}
      </div>
    </div>
  );
};

export const DashboardScreen: React.FC<{
  onNavigateToTab: (tab: any) => void;
  onOpenFlora?: () => void;
}> = ({ onNavigateToTab, onOpenFlora }) => {
  const {
    sensors,
    deviceStatus,
    controls,
    plants,
    activePlant,
    setActivePlantId,
    demoMode,
    simulateSensorsTick,
    userProfile,
    speakStatusBriefing
  } = useAgro();

  const [refreshing, setRefreshing] = useState(false);

  const handleManualRefresh = () => {
    setRefreshing(true);
    simulateSensorsTick();
    setTimeout(() => setRefreshing(false), 600);
  };

  const timeStr = new Date(sensors.lastUpdated).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Calculate status checks against active plant parameters
  const th = activePlant.thresholds;
  const moistureStatus =
    sensors.soilMoisture < th.minMoisture
      ? 'LOW'
      : sensors.soilMoisture > th.maxMoisture
      ? 'HIGH'
      : 'NORMAL';

  const tempDisplay =
    userProfile.tempUnit === 'F'
      ? (sensors.temperature * 1.8 + 32).toFixed(1)
      : sensors.temperature.toFixed(1);
  const tempUnit = userProfile.tempUnit === 'F' ? '°F' : '°C';
  const tempStatus =
    sensors.temperature < th.minTemp
      ? 'LOW'
      : sensors.temperature > th.maxTemp
      ? 'HIGH'
      : 'NORMAL';

  const humidityStatus =
    sensors.humidity < 40 ? 'LOW' : sensors.humidity > 80 ? 'HIGH' : 'NORMAL';

  const phStatus =
    sensors.soilPH < th.minPh
      ? 'LOW'
      : sensors.soilPH > th.maxPh
      ? 'HIGH'
      : 'NORMAL';

  const ecStatus =
    sensors.soilEC > 2.8 ? 'HIGH' : sensors.soilEC < 1.0 ? 'LOW' : 'NORMAL';

  // Overall plant condition calculation
  const isHealthy =
    moistureStatus === 'NORMAL' &&
    tempStatus === 'NORMAL' &&
    phStatus === 'NORMAL' &&
    ecStatus === 'NORMAL';

  return (
    <div className="p-4 space-y-4 pb-28 max-w-2xl mx-auto">
      {/* Demo Mode Notice Banner */}
      {demoMode && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 flex items-start justify-between gap-3 text-amber-900">
          <div className="flex items-start space-x-2.5">
            <span className="p-1 rounded-lg bg-amber-500/20 text-amber-800 font-mono text-[10px] font-bold uppercase mt-0.5 shrink-0">
              SIMULATOR
            </span>
            <div>
              <h4 className="text-xs font-bold text-amber-950">
                Simulation Telemetry Active
              </h4>
              <p className="text-[11px] text-amber-800/90 leading-relaxed mt-0.5">
                Displaying calibrated simulated readings. You can toggle live pump relays, inspect virtual breadboard wiring, and test automated irrigation thresholds.
              </p>
            </div>
          </div>
          <button
            onClick={handleManualRefresh}
            className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-amber-900 border border-amber-300 shadow-sm shrink-0 active:scale-95 transition"
            title="Simulate Sensor Read Tick"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      )}

      {/* Plant Selector Strip */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        {plants.map((p) => {
          const isSelected = p.id === activePlant.id;
          return (
            <button
              key={p.id}
              onClick={() => setActivePlantId(p.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition active:scale-95 border ${
                isSelected
                  ? 'bg-[#1b4332] text-white border-[#1b4332] shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <img
                src={p.imageUrl}
                alt={p.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-white/50"
              />
              <span className="truncate max-w-[130px]">{p.name}</span>
            </button>
          );
        })}
        <button
          onClick={() => onNavigateToTab('plants')}
          className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-[#1b4332] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 whitespace-nowrap transition"
        >
          <span>Manage</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* High-Tech Crop Condition & Telemetry Dashboard */}
      <div className="bg-gradient-to-br from-[#1b4332] via-[#245840] to-[#2d6a4f] text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-emerald-400/15 blur-2xl pointer-events-none" />

        <div className="flex justify-between items-start gap-3 mb-4">
          <div className="flex items-center space-x-2 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 font-mono text-[11px] text-emerald-200 border border-white/15">
              {activePlant.assignedDeviceId}
            </span>
            <span className="text-white/60">·</span>
            <span className="text-emerald-200 text-xs font-medium">
              Stage: {activePlant.growthStage}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 text-xs">
            <button
              onClick={speakStatusBriefing}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-200 transition"
              title="Voice Status Briefing"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-emerald-200">
              {deviceStatus.online ? `${deviceStatus.rssi} dBm` : 'Offline'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-emerald-300/80">
              Monitored Crop
            </p>
            <h2 className="text-xl font-extrabold text-white truncate tracking-tight">
              {activePlant.name}
            </h2>
            <p className="text-xs text-emerald-100/70 italic truncate">
              {activePlant.species}
            </p>

            <div className="mt-3 flex items-center space-x-2">
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex items-center space-x-1.5 ${
                  isHealthy
                    ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200'
                    : 'bg-amber-500/20 border-amber-400/40 text-amber-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isHealthy ? 'Overall Vigorous' : 'Attention Advised'}</span>
              </span>

              <button
                onClick={() => onNavigateToTab('lab')}
                className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-black/20 hover:bg-black/30 border border-emerald-400/30 text-emerald-200 transition flex items-center space-x-1"
              >
                <Cpu className="w-3 h-3 text-emerald-300" />
                <span>IoT Lab</span>
              </button>
            </div>
          </div>

          <img
            src={activePlant.imageUrl}
            alt={activePlant.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-white/30 shadow-md shrink-0"
          />
        </div>

        {/* Quick Actuator Bar inside Hero */}
        <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[10px] text-emerald-300/70 block uppercase font-mono">Pump Relay</span>
            <span className="font-bold text-white flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${controls.pumpActual ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'}`} />
              <span>{controls.pumpActual ? 'Running (Pumping)' : 'Standby / Idle'}</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigateToTab('control')}
              className="px-3 py-1.5 rounded-xl bg-white text-[#1b4332] font-bold text-xs shadow-md hover:bg-emerald-50 transition active:scale-95 flex items-center space-x-1"
            >
              <span>Control Valve</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Flora AI Voice & Text Assistant Summon Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-3.5 px-4 border border-slate-800 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src="/src/assets/images/flora_ai_avatar_1793774183839.jpg"
              alt="Flora AI"
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-400/70"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-white">Flora AI Voice Assistant</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                Siri / Alexa
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              Speak: "Turn on the pump" · "What is my soil moisture?"
            </p>
          </div>
        </div>

        <button
          onClick={onOpenFlora}
          className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-3 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition active:scale-95 shadow-md"
        >
          <Mic className="w-3.5 h-3.5 text-slate-950" />
          <span>Talk</span>
        </button>
      </div>

      {/* Smart Weather & Rain-Delay Widget */}
      <WeatherWidget />

      {/* Sensor Monitoring Grid (6 Core Cards with Newbie Explainer Mode) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Live Root & Canopy Telemetry
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">6 Sensors Online</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 1. Capacitive Soil Moisture Sensor */}
          <SensorCard
            title="Soil Moisture"
            subtitle="Capacitive Sensor v1.2"
            value={sensors.soilMoisture.toFixed(1)}
            unit="%"
            status={moistureStatus}
            icon={<Droplets className="w-4 h-4" />}
            timeStr={timeStr}
            targetRange={`${th.minMoisture}% – ${th.maxMoisture}%`}
            accentBg="bg-blue-50"
            accentText="text-blue-600"
            percentage={sensors.soilMoisture}
            isNewbieMode={userProfile.newbieMode}
            newbieExplanation={`Soil holds ${sensors.soilMoisture.toFixed(0)}% water. Like a damp wrung-out sponge, root hairs can absorb oxygen while drinking easily.`}
            onClickConfigure={() => onNavigateToTab('control')}
          />

          {/* 2. Substrate & Canopy Temperature */}
          <SensorCard
            title="Temperature"
            subtitle="DHT22 Digital Sensor"
            value={tempDisplay}
            unit={tempUnit}
            status={tempStatus}
            icon={<Thermometer className="w-4 h-4" />}
            timeStr={timeStr}
            targetRange={`${th.minTemp}°C – ${th.maxTemp}°C`}
            accentBg="bg-amber-50"
            accentText="text-amber-600"
            percentage={(sensors.temperature / 40) * 100}
            isNewbieMode={userProfile.newbieMode}
            newbieExplanation={`${sensors.temperature.toFixed(0)}°C is a gentle spring temperature. Ideal for cell division and sugar synthesis.`}
          />

          {/* 3. Air Humidity */}
          <SensorCard
            title="Air Humidity"
            subtitle="DHT22 Capacitive RH"
            value={sensors.humidity.toFixed(1)}
            unit="% RH"
            status={humidityStatus}
            icon={<Wind className="w-4 h-4" />}
            timeStr={timeStr}
            targetRange="40% – 80% RH"
            accentBg="bg-teal-50"
            accentText="text-teal-600"
            percentage={sensors.humidity}
            isNewbieMode={userProfile.newbieMode}
            newbieExplanation={`${sensors.humidity.toFixed(0)}% relative humidity means the ambient air is mildly humid, preventing leaves from drying out.`}
          />

          {/* 4. Soil pH Level */}
          <SensorCard
            title="Soil pH Level"
            subtitle="Analog pH Probe Module"
            value={sensors.soilPH.toFixed(2)}
            unit="pH"
            status={phStatus}
            icon={<TestTube className="w-4 h-4" />}
            timeStr={timeStr}
            targetRange={`${th.minPh} – ${th.maxPh} pH`}
            accentBg="bg-purple-50"
            accentText="text-purple-600"
            percentage={(sensors.soilPH / 14) * 100}
            isNewbieMode={userProfile.newbieMode}
            newbieExplanation={`pH ${sensors.soilPH.toFixed(1)} is slightly acidic—the universal sweet spot where fertilizer nutrients remain 100% soluble.`}
          />

          {/* 5. Soil Electrical Conductivity */}
          <SensorCard
            title="Electrical Conductivity"
            subtitle="Analog EC Salinity Probe"
            value={sensors.soilEC.toFixed(2)}
            unit="mS/cm"
            status={ecStatus}
            icon={<Activity className="w-4 h-4" />}
            timeStr={timeStr}
            targetRange="1.2 – 2.4 mS/cm"
            accentBg="bg-emerald-50"
            accentText="text-emerald-600"
            percentage={(sensors.soilEC / 4) * 100}
            isNewbieMode={userProfile.newbieMode}
            newbieExplanation={`EC measures dissolved minerals. ${sensors.soilEC.toFixed(2)} mS/cm confirms adequate plant food without burning root tips.`}
          />

          {/* 6. RS485 / Modbus NPK Sensor */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-2xl bg-indigo-50 text-indigo-600">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-tight">NPK Nutrients</h4>
                    <p className="text-[10px] text-slate-400 font-mono">RS485 / Modbus RTU</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 font-mono">
                  ACTIVE
                </span>
              </div>

              {/* 3 Macro elements N-P-K */}
              <div className="grid grid-cols-3 gap-2 my-2 text-center">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block font-mono">N (Leaves)</span>
                  <span className="text-sm font-black text-slate-900 font-mono">{sensors.nitrogen}</span>
                  <span className="text-[9px] text-slate-400 block">mg/kg</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block font-mono">P (Roots)</span>
                  <span className="text-sm font-black text-slate-900 font-mono">{sensors.phosphorus}</span>
                  <span className="text-[9px] text-slate-400 block">mg/kg</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block font-mono">K (Fruit)</span>
                  <span className="text-sm font-black text-slate-900 font-mono">{sensors.potassium}</span>
                  <span className="text-[9px] text-slate-400 block">mg/kg</span>
                </div>
              </div>

              {userProfile.newbieMode && (
                <div className="mt-2 p-2 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-950 flex items-start space-x-1.5 leading-relaxed">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <span>N feeds leafy growth; P builds blooms; K enlarges juicy tomatoes.</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
              <span>Modbus 9600-8N1</span>
              <button
                onClick={() => onNavigateToTab('assistant')}
                className="text-[#1b4332] hover:underline font-semibold font-sans flex items-center"
              >
                Advisor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Commercial Canopy Transpiration (VPD) Calculator */}
      <VpdCalculator />
    </div>
  );
};
