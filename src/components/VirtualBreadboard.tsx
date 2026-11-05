import React, { useState } from 'react';
import { useAgro } from '../context/AppContext';
import {
  Cpu,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Activity,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Wrench
} from 'lucide-react';
import { HardwarePinInfo } from '../types';

export const pinDatabase: HardwarePinInfo[] = [
  {
    pinNumber: 34,
    label: 'GPIO 34',
    gpioName: 'GPIO34 / ADC1_CH6',
    type: 'ADC1',
    connectedDevice: 'Capacitive Soil Moisture Sensor v1.2 (AOUT)',
    currentVoltage: '1.42V (~45% moisture)',
    purpose: 'Analog voltage reading proportional to substrate dielectric permittivity.',
    safetyNote: 'ADC1 only. Never connect to 5V; maximum analog input is 3.3V.'
  },
  {
    pinNumber: 4,
    label: 'GPIO 4',
    gpioName: 'GPIO4 / ADC2_CH0',
    type: 'GPIO_OUT',
    connectedDevice: 'DHT22 Digital Temperature & Humidity (DATA)',
    currentVoltage: '3.3V (Idle Pull-up)',
    purpose: 'One-Wire proprietary bidirectional serial protocol with 10kΩ pull-up.',
    safetyNote: 'Requires a 4.7kΩ to 10kΩ resistor between DATA and 3.3V rail.'
  },
  {
    pinNumber: 19,
    label: 'GPIO 19',
    gpioName: 'GPIO19 / VSPI_MISO',
    type: 'GPIO_OUT',
    connectedDevice: '5V Optocoupler Relay Module (IN)',
    currentVoltage: '3.3V (Relay Open / Standby)',
    purpose: 'Digital output switching the transistor optocoupler coil to engage pump.',
    safetyNote: 'Active LOW on most relay boards: LOW (0V) = Pump ON, HIGH (3.3V) = Pump OFF.'
  },
  {
    pinNumber: 35,
    label: 'GPIO 35',
    gpioName: 'GPIO35 / ADC1_CH7',
    type: 'ADC1',
    connectedDevice: 'Analog pH Sensor Board (Po / AOUT)',
    currentVoltage: '1.85V (~6.45 pH)',
    purpose: 'Calibrated voltage signal representing hydrogen ion concentration.',
    safetyNote: 'Ensure op-amp board output does not exceed 3.3V or use a 2:3 voltage divider.'
  },
  {
    pinNumber: 32,
    label: 'GPIO 32',
    gpioName: 'GPIO32 / ADC1_CH4',
    type: 'ADC1',
    connectedDevice: 'Analog Soil Electrical Conductivity (EC)',
    currentVoltage: '1.60V (~1.85 mS/cm)',
    purpose: 'Measures ionic conductivity to estimate dissolved fertilizer salt level.',
    safetyNote: 'Clean probe periodically with distilled water to prevent salt encrustation.'
  },
  {
    pinNumber: 16,
    label: 'GPIO 16',
    gpioName: 'GPIO16 / RX2',
    type: 'UART',
    connectedDevice: 'MAX485 Transceiver (RO / Receiver Output)',
    currentVoltage: '3.3V Serial Logic',
    purpose: 'Hardware Serial UART2 receive line for Modbus RTU NPK inquiry replies.',
    safetyNote: 'Baud rate set to 9600 8N1 in firmware.'
  },
  {
    pinNumber: 17,
    label: 'GPIO 17',
    gpioName: 'GPIO17 / TX2',
    type: 'UART',
    connectedDevice: 'MAX485 Transceiver (DI / Driver Input)',
    currentVoltage: '3.3V Serial Logic',
    purpose: 'Hardware Serial UART2 transmit line for Modbus RTU hex inquiry query.',
    safetyNote: 'Toggle DE/RE pin HIGH to transmit and LOW to receive.'
  },
  {
    pinNumber: 5,
    label: 'GPIO 5',
    gpioName: 'GPIO5 / VSPI_CS',
    type: 'GPIO_OUT',
    connectedDevice: 'MAX485 Transceiver (DE & RE Direction Control)',
    currentVoltage: '0V (Receive mode)',
    purpose: 'Controls RS485 bus direction. HIGH = Transmit Frame, LOW = Listen.',
    safetyNote: 'Bridge DE and RE pins together on MAX485 module.'
  }
];

export const VirtualBreadboard: React.FC = () => {
  const { controls, executePumpToggle, sensors } = useAgro();
  const [selectedPin, setSelectedPin] = useState<HardwarePinInfo | null>(pinDatabase[0]);
  const [testPulseActive, setTestPulseActive] = useState(false);
  const [activeTroubleshoot, setActiveTroubleshoot] = useState<number | null>(null);

  const handleTestRelayBlink = async () => {
    setTestPulseActive(true);
    await executePumpToggle(true);
    setTimeout(async () => {
      await executePumpToggle(false);
      setTestPulseActive(false);
    }, 2000);
  };

  const troubleshootingItems = [
    {
      title: 'Capacitive Moisture Sensor returns 0% or 100% continuously',
      cause: 'Analog pin plugged into ADC2 while Wi-Fi is transmitting, or VCC connected to 5V instead of 3.3V.',
      solution: 'Ensure sensor is connected strictly to ADC1 (GPIO 32, 33, 34, 35, 36, 39). ADC2 cannot be sampled when Wi-Fi radio is active. Use 3.3V power.'
    },
    {
      title: 'DHT22 sensor reports NaN or values do not update',
      cause: 'Missing 10kΩ pull-up resistor between the DATA line and the 3.3V rail.',
      solution: 'Solder or insert a 4.7kΩ - 10kΩ resistor across VCC and DATA pins on the DHT22 breakout.'
    },
    {
      title: 'Relay clicks but 12V pump motor fails to turn on',
      cause: 'Relay is an isolated dry switch; it does not output voltage on its own.',
      solution: 'Wire an external 12V DC 2A power brick through the Relay COM (Common) and NO (Normally Open) terminals in series with the pump.'
    },
    {
      title: 'NPK Modbus sensor returns zeros (0-0-0)',
      cause: 'Reversed RS485 A/B lines or missing DE/RE direction toggle in C++ firmware.',
      solution: 'Swap lines A and B. Ensure GPIO 5 is driven HIGH before transmitting the inquiry frame and driven LOW before reading.'
    }
  ];

  return (
    <div className="space-y-4">
      {/* High-Tech Circuit Breadboard View */}
      <div className="bg-slate-950 text-white rounded-3xl p-5 shadow-xl border border-slate-800 space-y-4 overflow-hidden relative">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Interactive IoT Hardware Lab</h3>
              <p className="text-[11px] text-emerald-400/80 font-mono">ESP32 DevKit v1 Virtual Breadboard</p>
            </div>
          </div>

          <button
            onClick={handleTestRelayBlink}
            disabled={testPulseActive}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition active:scale-95 shadow-lg shadow-emerald-900/40"
          >
            <Zap className={`w-3.5 h-3.5 ${testPulseActive ? 'animate-bounce text-amber-300' : ''}`} />
            <span>{testPulseActive ? 'Testing GPIO 19...' : 'Test Pulse Relay'}</span>
          </button>
        </div>

        {/* Interactive Schematic Diagram SVG */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 overflow-x-auto no-scrollbar">
          <div className="min-w-[480px] flex justify-between items-center py-2 relative">
            {/* ESP32 Microcontroller Node */}
            <div className="w-44 bg-slate-900 border-2 border-emerald-500/60 rounded-2xl p-3 shadow-2xl relative">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-2">
                <span className="text-[11px] font-black font-mono text-emerald-400">ESP32-WROOM</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-mono">
                  30 PIN
                </span>
              </div>

              {/* Pin buttons on ESP32 */}
              <div className="space-y-1.5">
                {pinDatabase.map((pin) => {
                  const isSelected = selectedPin?.pinNumber === pin.pinNumber;
                  const isRelayPin = pin.pinNumber === 19;
                  const isEnergized = isRelayPin && controls.pumpActual;

                  return (
                    <button
                      key={pin.pinNumber}
                      onClick={() => setSelectedPin(pin)}
                      className={`w-full text-left px-2 py-1 rounded-lg text-[10px] font-mono flex items-center justify-between transition border ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md'
                          : isEnergized
                          ? 'bg-rose-500/30 text-rose-300 border-rose-500 animate-pulse'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border-slate-700'
                      }`}
                    >
                      <span>{pin.label}</span>
                      <span className="text-[9px] opacity-80">{pin.type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Connecting Bus Line Graphics */}
            <div className="flex-1 px-4 flex flex-col justify-around h-full space-y-3">
              <div className="h-0.5 bg-gradient-to-r from-emerald-500/60 to-blue-500/60 rounded-full" />
              <div className="h-0.5 bg-gradient-to-r from-emerald-500/60 to-amber-500/60 rounded-full" />
              <div className="h-0.5 bg-gradient-to-r from-emerald-500/60 to-purple-500/60 rounded-full" />
              <div className="h-0.5 bg-gradient-to-r from-emerald-500/60 to-rose-500/60 rounded-full" />
            </div>

            {/* Attached Sensor Breakouts */}
            <div className="w-56 space-y-2">
              {/* Soil Probe */}
              <div
                onClick={() => setSelectedPin(pinDatabase[0])}
                className="bg-slate-900 border border-blue-500/40 p-2.5 rounded-xl cursor-pointer hover:border-blue-400 transition"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-blue-300">Capacitive Moisture</span>
                  <span className="text-[10px] font-mono text-slate-400">{sensors.soilMoisture.toFixed(1)}%</span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono">Analog AOUT → GPIO 34 (1.42V)</span>
              </div>

              {/* DHT22 */}
              <div
                onClick={() => setSelectedPin(pinDatabase[1])}
                className="bg-slate-900 border border-amber-500/40 p-2.5 rounded-xl cursor-pointer hover:border-amber-400 transition"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-amber-300">DHT22 Temp & Hum</span>
                  <span className="text-[10px] font-mono text-slate-400">{sensors.temperature}°C</span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono">1-Wire DATA → GPIO 4 (3.3V)</span>
              </div>

              {/* Relay */}
              <div
                onClick={() => setSelectedPin(pinDatabase[2])}
                className={`border p-2.5 rounded-xl cursor-pointer transition ${
                  controls.pumpActual
                    ? 'bg-rose-950/40 border-rose-500 shadow-lg'
                    : 'bg-slate-900 border-slate-700 hover:border-emerald-400'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-300">1-Ch Solenoid Relay</span>
                  <span className={`text-[10px] font-mono font-bold ${controls.pumpActual ? 'text-rose-400' : 'text-slate-400'}`}>
                    {controls.pumpActual ? 'ENERGIZED' : 'STANDBY'}
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono">Logic IN → GPIO 19 (Active Low)</span>
              </div>

              {/* MAX485 NPK */}
              <div
                onClick={() => setSelectedPin(pinDatabase[5])}
                className="bg-slate-900 border border-purple-500/40 p-2.5 rounded-xl cursor-pointer hover:border-purple-400 transition"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-purple-300">MAX485 Modbus NPK</span>
                  <span className="text-[10px] font-mono text-slate-400">9600-8N1</span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono">UART2 RX16 / TX17 / DE5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Pin Inspector Detail Panel */}
        {selectedPin && (
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-emerald-500/30 text-xs space-y-2 animate-in fade-in">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Hardware Inspector Pin Focus
                </span>
                <h4 className="text-base font-extrabold text-white mt-0.5">
                  {selectedPin.gpioName}
                </h4>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                {selectedPin.currentVoltage}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 text-[11px] pt-1">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block font-bold mb-0.5">Attached Hardware</span>
                <span>{selectedPin.connectedDevice}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block font-bold mb-0.5">Signal Role</span>
                <span>{selectedPin.purpose}</span>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-amber-200 text-[11px] leading-relaxed">
              <strong>Newbie Safety Warning:</strong> {selectedPin.safetyNote}
            </div>
          </div>
        )}
      </div>

      {/* Hardware Troubleshooting Wizard */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center space-x-2">
          <Wrench className="w-5 h-5 text-[#1b4332]" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Beginner Hardware Troubleshooter</h3>
            <p className="text-[11px] text-slate-400">Step-by-step solutions to common microcontroller snags</p>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          {troubleshootingItems.map((item, idx) => {
            const isOpen = activeTroubleshoot === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveTroubleshoot(isOpen ? null : idx)}
                  className="w-full text-left p-3.5 flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-50"
                >
                  <span className="pr-2">{item.title}</span>
                  <span className="text-slate-400 font-mono text-sm">{isOpen ? '−' : '+'}</span>
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-3.5 text-xs text-slate-600 space-y-2 bg-slate-50/70 border-t border-slate-100">
                    <p className="pt-2 text-[11px]">
                      <strong className="text-slate-900">Root Cause:</strong> {item.cause}
                    </p>
                    <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-emerald-900 text-[11px] leading-relaxed">
                      <strong>Fix:</strong> {item.solution}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
