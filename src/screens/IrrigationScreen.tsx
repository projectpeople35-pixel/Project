import React, { useState } from 'react';
import { useAgro } from '../context/AppContext';
import { TankSentry } from '../components/TankSentry';
import {
  Power,
  AlertOctagon,
  RefreshCw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Cpu,
  Sliders,
  Droplets,
  AlertTriangle,
  History,
  RotateCcw,
  CloudRain,
  Sparkles
} from 'lucide-react';

export const IrrigationScreen: React.FC = () => {
  const {
    controls,
    sensors,
    deviceStatus,
    activePlant,
    executePumpToggle,
    executeEmergencyHalt,
    resetEmergencyStop,
    updateIrrigationConfig
  } = useAgro();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Local form state
  const [thresholdInput, setThresholdInput] = useState(controls.moistureThreshold);
  const [runtimeInput, setRuntimeInput] = useState(controls.maxPumpRuntimeSec);
  const [durationInput, setDurationInput] = useState(controls.wateringDurationSec);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleManualPumpToggle = async (turnOn: boolean) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await executePumpToggle(turnOn);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch command.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveParameters = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await updateIrrigationConfig(
        controls.irrigationMode,
        thresholdInput,
        runtimeInput,
        durationInput
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = async (mode: 'MANUAL' | 'AUTO') => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await updateIrrigationConfig(mode, thresholdInput, runtimeInput, durationInput);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to change mode.');
    } finally {
      setLoading(false);
    }
  };

  const isCommandInFlight = controls.pumpRequested !== controls.pumpActual;
  const isDeviceOffline = !deviceStatus.online;

  return (
    <div className="p-4 space-y-4 pb-28 max-w-2xl mx-auto">
      {/* Emergency Lockout Banner if active */}
      {controls.emergencyStop && (
        <div className="bg-rose-600 text-white p-4 rounded-2xl shadow-lg border border-rose-700 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <AlertOctagon className="w-6 h-6 text-white shrink-0" />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide">
                  Emergency Stop Active
                </h3>
                <p className="text-xs text-rose-100">
                  Hardware relay is physically locked OFF. All automatic and manual valve operations are inhibited.
                </p>
              </div>
            </div>
            <button
              onClick={resetEmergencyStop}
              className="bg-white text-rose-700 hover:bg-rose-50 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-md transition active:scale-95 shrink-0"
            >
              Reset Safety Lock
            </button>
          </div>
        </div>
      )}

      {/* Safety Notice if offline */}
      {isDeviceOffline && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-900 p-3.5 rounded-2xl text-xs flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            <strong>Device Offline:</strong> Irrigation commands require verified bidirectional ESP32 connectivity. Actuation is disabled for plant safety.
          </span>
        </div>
      )}

      {/* Rain Delay Notice if active */}
      {controls.rainDelayActive && (
        <div className="bg-blue-500/10 border border-blue-500/30 text-blue-900 p-4 rounded-2xl text-xs flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <CloudRain className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <strong className="block text-slate-900">Smart Rain-Delay Engaged:</strong>
              <span className="text-[11px] text-slate-600">
                Automated drip cycles are paused to prevent waterlogging from incoming rain.
              </span>
            </div>
          </div>
          <button
            onClick={() =>
              updateIrrigationConfig(
                controls.irrigationMode,
                controls.moistureThreshold,
                controls.maxPumpRuntimeSec,
                controls.wateringDurationSec,
                false
              )
            }
            className="text-[11px] font-bold text-blue-800 bg-white px-2.5 py-1 rounded-xl border border-blue-200 shadow-sm shrink-0"
          >
            Resume
          </button>
        </div>
      )}

      {/* Water Tank Reservoir Telemetry */}
      <TankSentry />

      {/* Two-Phase Relay Telemetry Card (Requested vs Confirmed Actual) */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-xl ${controls.pumpActual ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pump Operating State</h3>
              <p className="text-[11px] text-slate-400">GPIO 19 Relay Feedback</p>
            </div>
          </div>

          <span
            className={`text-xs font-black px-3 py-1 rounded-full border ${
              controls.pumpActual
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 animate-pulse'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {controls.pumpActual ? 'VALVE ENERGIZED / PUMPING' : 'CLOSED / STANDBY'}
          </span>
        </div>

        {/* Handshake Telemetry Split */}
        <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              1. Cloud Command State
            </span>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className={`w-2 h-2 rounded-full ${controls.pumpRequested ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <span className={`text-xs font-bold font-mono ${controls.pumpRequested ? 'text-emerald-700' : 'text-slate-700'}`}>
                {controls.pumpRequested ? 'REQUEST: ON' : 'REQUEST: OFF'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              2. ESP32 Hardware Confirmation
            </span>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className={`w-2 h-2 rounded-full ${controls.pumpActual ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <span className={`text-xs font-bold font-mono ${controls.pumpActual ? 'text-emerald-700' : 'text-slate-700'}`}>
                {controls.pumpActual ? 'CONFIRMED: ON' : 'CONFIRMED: OFF'}
              </span>
            </div>
          </div>
        </div>

        {/* In-flight handshake spinner */}
        {isCommandInFlight && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-center space-x-2 text-xs text-amber-800">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600 shrink-0" />
            <span>ESP32 is verifying command safety limits before opening relay...</span>
          </div>
        )}

        {/* Manual Actuator Controls */}
        <div className="pt-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Manual Solenoid Actuator
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleManualPumpToggle(true)}
              disabled={loading || controls.pumpActual || controls.emergencyStop || isDeviceOffline}
              className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition active:scale-95"
            >
              <Power className="w-4 h-4" />
              <span className="text-xs">Turn Pump ON</span>
            </button>

            <button
              onClick={() => handleManualPumpToggle(false)}
              disabled={loading || (!controls.pumpActual && !controls.pumpRequested)}
              className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition active:scale-95"
            >
              <Power className="w-4 h-4" />
              <span className="text-xs">Turn Pump OFF</span>
            </button>
          </div>
        </div>

        {/* Emergency Stop Button */}
        <button
          onClick={executeEmergencyHalt}
          disabled={controls.emergencyStop}
          className="w-full flex items-center justify-center space-x-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-black py-3 px-4 rounded-xl shadow-md transition active:scale-95"
        >
          <AlertOctagon className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wider">Emergency Kill Switch</span>
        </button>
      </div>

      {/* Automatic Irrigation Configuration & Limits */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Automation Parameters</h3>
            <p className="text-[11px] text-slate-400">Target for {activePlant.name}</p>
          </div>

          {/* Mode switch */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => handleModeChange('AUTO')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                controls.irrigationMode === 'AUTO'
                  ? 'bg-[#1b4332] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              AUTOMATIC
            </button>
            <button
              onClick={() => handleModeChange('MANUAL')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                controls.irrigationMode === 'MANUAL'
                  ? 'bg-[#1b4332] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              MANUAL ONLY
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-1">
          {/* Threshold Slider */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs font-semibold text-slate-700">Soil Moisture Threshold</span>
              <span className="text-sm font-black text-[#1b4332] font-mono">{thresholdInput}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="70"
              value={thresholdInput}
              onChange={(e) => setThresholdInput(Number(e.target.value))}
              className="w-full accent-[#1b4332] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>Dry (20%)</span>
              <span>Current: {sensors.soilMoisture.toFixed(1)}%</span>
              <span>Saturated (70%)</span>
            </div>
          </div>

          {/* Watering Duration */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs font-semibold text-slate-700">Watering Pulse Duration</span>
              <span className="text-sm font-black text-[#1b4332] font-mono">{durationInput} sec</span>
            </div>
            <input
              type="range"
              min="10"
              max="120"
              step="5"
              value={durationInput}
              onChange={(e) => setDurationInput(Number(e.target.value))}
              className="w-full accent-[#1b4332] cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 mt-0.5">
              Estimated volume per cycle: ~{((durationInput * 2.4) / 60).toFixed(1)} Litres at 1.5 bar.
            </p>
          </div>

          {/* Max Runtime Safety Cutoff */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs font-semibold text-slate-700">Hardware Cutoff Max Runtime</span>
              <span className="text-sm font-black text-[#1b4332] font-mono">{runtimeInput} sec</span>
            </div>
            <input
              type="range"
              min="15"
              max="300"
              step="5"
              value={runtimeInput}
              onChange={(e) => setRuntimeInput(Number(e.target.value))}
              className="w-full accent-[#1b4332] cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 mt-0.5">
              Firmware failsafe: ESP32 terminates relay if timer exceeds this limit even if cloud connection drops.
            </p>
          </div>

          <button
            onClick={handleSaveParameters}
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition active:scale-95 flex items-center justify-center space-x-1"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Configuration Saved</span>
              </>
            ) : (
              <span>Update Safety & Automation Thresholds</span>
            )}
          </button>
        </div>
      </div>

      {/* Watering History Log */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Irrigation History
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {controls.wateringHistory.length} events logged
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {controls.wateringHistory.map((item) => (
            <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                    item.triggerType === 'AUTO' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {item.triggerType}
                  </span>
                  <span className="font-bold text-slate-800">{item.durationSec}s cycle</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500 font-mono">{item.waterVolumeLiters}L</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                  Moisture shift: {item.initialMoisture}% → {item.finalMoisture}%
                </div>
              </div>

              <div className="text-right text-[10px] text-slate-400 font-mono">
                {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
