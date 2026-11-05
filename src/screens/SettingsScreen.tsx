import React, { useState } from 'react';
import { useAgro } from '../context/AppContext';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import {
  User,
  Cpu,
  Wifi,
  Bell,
  Sliders,
  LogOut,
  Info,
  Code,
  FileText,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Shield,
  Zap,
  RotateCcw,
  Users,
  Heart,
  Languages,
  Search,
  Volume2
} from 'lucide-react';
import { LANGUAGES, getLanguage, LanguageDefinition } from '../services/languages';

export const SettingsScreen: React.FC<{ onLogout: () => void; onNavigateToTab?: (tab: any) => void }> = ({ onLogout, onNavigateToTab }) => {
  const {
    user,
    userProfile,
    updateUserProfile,
    setLanguage,
    deviceStatus,
    selectedDeviceId,
    demoMode,
    setDemoMode
  } = useAgro();

  const [copiedCode, setCopiedCode] = useState(false);
  const [activeModal, setActiveModal] = useState<'firmware' | 'wiring' | 'calibration' | 'firebase' | null>(null);

  // Language management state
  const [langSearch, setLangSearch] = useState('');
  const [langTab, setLangTab] = useState<'ALL' | 'INDIAN' | 'FOREIGN'>('INDIAN');
  const activeLangDef = React.useMemo(() => getLanguage(userProfile.language), [userProfile.language]);

  const speakLanguageGreeting = (lang: LanguageDefinition) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(lang.sampleGreeting);
    utterance.lang = lang.bcp47;
    utterance.rate = 1.0;
    utterance.pitch = 1.02;

    const voices = window.speechSynthesis.getVoices();
    const langPrefix = lang.bcp47.split('-')[0].toLowerCase();
    const matchedVoice = voices.find((v) =>
      v.lang.toLowerCase().replace('_', '-').startsWith(langPrefix)
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const displayedLanguages = React.useMemo(() => {
    return LANGUAGES.filter((l) => {
      const matchCat =
        langTab === 'ALL'
          ? true
          : langTab === 'INDIAN'
          ? l.category === 'INDIAN_CONSTITUTION'
          : l.category === 'INTERNATIONAL';

      const matchSearch =
        !langSearch.trim() ||
        l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
        l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
        l.region.toLowerCase().includes(langSearch.toLowerCase());

      return matchCat && matchSearch;
    });
  }, [langTab, langSearch]);

  // Calibration state for capacitive moisture
  const [airValue, setAirValue] = useState(3200);
  const [waterValue, setWaterValue] = useState(1350);
  const [calibratedSuccess, setCalibratedSuccess] = useState(false);

  // Firebase config input state
  const [customDbUrl, setCustomDbUrl] = useState(userProfile.customFirebaseUrl || '');

  const copyFirmware = () => {
    navigator.clipboard.writeText(`// ESP32 AgroSmart Production Firmware v1.2.0
#include <WiFi.h>
#include <FirebaseESP32.h>
#include <DHT.h>
#define PIN_SOIL_MOISTURE 34
#define PIN_PUMP_RELAY 19
#define PIN_PH_SENSOR 35
#define PIN_EC_SENSOR 32
#define DHTPIN 4
// Full firmware source is available in the documentation.`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSaveCalibration = (e: React.FormEvent) => {
    e.preventDefault();
    setCalibratedSuccess(true);
    setTimeout(() => {
      setCalibratedSuccess(false);
      setActiveModal(null);
    }, 1200);
  };

  return (
    <div className="p-4 space-y-4 pb-28 max-w-2xl mx-auto">
      {/* User Profile Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#1b4332] flex items-center justify-center font-bold text-lg shrink-0">
            {user?.email ? user.email.slice(0, 2).toUpperCase() : 'AG'}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 truncate">
              {user ? user.email : userProfile.displayName}
            </h3>
            <p className="text-xs text-slate-400 font-mono truncate">
              {user ? `UID: ${user.uid.slice(0, 16)}...` : 'Interactive Demo Profile'}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition active:scale-95 border border-rose-200"
          title="Sign Out / Switch Mode"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Connected ESP32 Hardware Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-[#1b4332]" />
            <h3 className="text-sm font-bold text-slate-900">ESP32 Hardware Node</h3>
          </div>
          <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {selectedDeviceId}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <div>
            <span className="text-[10px] text-slate-400 block font-sans font-semibold">Status</span>
            <span className={deviceStatus.online ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
              {deviceStatus.online ? 'Online (Active)' : 'Offline'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-sans font-semibold">IP Address</span>
            <span className="text-slate-800">{deviceStatus.ip}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-sans font-semibold">Firmware</span>
            <span className="text-slate-800">{deviceStatus.firmwareVersion}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-sans font-semibold">Free Heap</span>
            <span className="text-slate-800">{Math.round(deviceStatus.freeHeapBytes / 1024)} KB</span>
          </div>
        </div>

        {/* Quick action buttons for ESP32 */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => setActiveModal('wiring')}
            className="flex items-center justify-center space-x-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold transition active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Wiring Guide</span>
          </button>

          <button
            onClick={() => setActiveModal('firmware')}
            className="flex items-center justify-center space-x-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold transition active:scale-95"
          >
            <Code className="w-3.5 h-3.5 text-blue-500" />
            <span>Arduino C++ Code</span>
          </button>
        </div>
      </div>

      {/* Language & Regional Localization Section (22 Indian Constitution + 18 Foreign Languages) */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Languages className="w-5 h-5 text-[#1b4332]" />
            <h3 className="text-sm font-bold text-slate-900">
              Language & Regional Localization
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            40 Supported
          </span>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Supports all 22 official regional languages in the 8th Schedule of the Constitution of India, plus major foreign languages. Flora AI speech recognition and vocal responses adapt instantaneously to your selection.
        </p>

        {/* Current Active Language Banner with Audio Sample */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-3.5 rounded-2xl border border-emerald-200/80 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-baseline space-x-2">
              <span className="text-base font-black text-slate-900 font-sans">
                {activeLangDef.nativeName}
              </span>
              <span className="text-xs font-semibold text-emerald-900">
                ({activeLangDef.name})
              </span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/80 px-2 py-0.2 rounded-full">
                {activeLangDef.category === 'INDIAN_CONSTITUTION' ? 'Constitution of India' : 'International'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate font-mono">
              Region: {activeLangDef.region} · Code: {activeLangDef.bcp47}
            </p>
          </div>

          <button
            onClick={() => speakLanguageGreeting(activeLangDef)}
            className="p-2 px-3 rounded-xl bg-white hover:bg-emerald-100 text-[#1b4332] border border-emerald-200 transition active:scale-95 shadow-sm shrink-0 flex items-center space-x-1.5"
            title="Hear Flora AI in this language"
          >
            <Volume2 className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold">Hear Flora</span>
          </button>
        </div>

        {/* Category Tabs: Indian Constitution (22) vs International (18) vs All */}
        <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setLangTab('INDIAN')}
            className={`flex-1 py-1.5 rounded-xl transition ${
              langTab === 'INDIAN'
                ? 'bg-white text-[#1b4332] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Constitution of India (22)
          </button>
          <button
            onClick={() => setLangTab('FOREIGN')}
            className={`flex-1 py-1.5 rounded-xl transition ${
              langTab === 'FOREIGN'
                ? 'bg-white text-[#1b4332] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            International (18)
          </button>
          <button
            onClick={() => setLangTab('ALL')}
            className={`px-3 py-1.5 rounded-xl transition ${
              langTab === 'ALL'
                ? 'bg-white text-[#1b4332] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All (40)
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search language (e.g. Hindi, Bengali, Tamil, Telugu, Spanish, French)..."
            value={langSearch}
            onChange={(e) => setLangSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
          />
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
          {displayedLanguages.map((lang) => {
            const isSelected = lang.code === userProfile.language;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  speakLanguageGreeting(lang);
                }}
                className={`p-3 rounded-2xl border text-left transition flex items-center justify-between active:scale-[0.98] ${
                  isSelected
                    ? 'bg-emerald-50/90 border-[#1b4332] shadow-sm ring-1 ring-[#1b4332]'
                    : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-baseline space-x-1.5">
                    <span className="font-extrabold text-sm text-slate-900 font-sans">
                      {lang.nativeName}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      {lang.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                    {lang.region}
                  </p>
                </div>

                <div className="shrink-0 flex items-center space-x-1.5">
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-200/70 text-slate-600">
                    {lang.code.toUpperCase()}
                  </span>
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-[#1b4332] text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-300" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Measurement Preferences & Units */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Units & Display
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          {/* Temperature unit */}
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">Temperature Scale</span>
              <span className="text-slate-400 text-[11px]">Select thermal units for charts & telemetry</span>
            </div>
            <div className="flex bg-slate-100 p-0.5 rounded-xl">
              <button
                onClick={() => updateUserProfile({ tempUnit: 'C' })}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  userProfile.tempUnit === 'C' ? 'bg-white text-[#1b4332] shadow-sm' : 'text-slate-500'
                }`}
              >
                Celsius (°C)
              </button>
              <button
                onClick={() => updateUserProfile({ tempUnit: 'F' })}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  userProfile.tempUnit === 'F' ? 'bg-white text-[#1b4332] shadow-sm' : 'text-slate-500'
                }`}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>

          {/* Newbie Explainer Mode */}
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">Plain-English Newbie Mode</span>
              <span className="text-slate-400 text-[11px]">Translates technical EC, pH and NPK numbers into simple advice</span>
            </div>
            <input
              type="checkbox"
              checked={userProfile.newbieMode}
              onChange={(e) => updateUserProfile({ newbieMode: e.target.checked })}
              className="w-5 h-5 accent-[#1b4332] rounded cursor-pointer"
            />
          </div>

          {/* Sound & Notifications */}
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">Push Notifications</span>
              <span className="text-slate-400 text-[11px]">Instant alerts on moisture deficit or pump halt</span>
            </div>
            <input
              type="checkbox"
              checked={userProfile.notificationsEnabled}
              onChange={(e) => updateUserProfile({ notificationsEnabled: e.target.checked })}
              className="w-5 h-5 accent-[#1b4332] rounded cursor-pointer"
            />
          </div>

          {/* Sensor Calibration modal trigger */}
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">Sensor ADC Calibration</span>
              <span className="text-slate-400 text-[11px]">Calibrate dry air and submerged water values</span>
            </div>
            <button
              onClick={() => setActiveModal('calibration')}
              className="px-3 py-1.5 text-xs font-bold text-[#1b4332] bg-emerald-50 hover:bg-emerald-100 rounded-xl transition"
            >
              Calibrate
            </button>
          </div>
        </div>
      </div>

      {/* Cloud & Firebase Connection */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-[#1b4332]" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Firebase IoT Cloud Database
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Encrypted RTDB
          </span>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          AgroSmart synchronizes bidirectionally with Firebase Realtime Database. Each user's plants and devices are securely isolated in private trees with role security rules.
        </p>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-[11px] text-slate-600 truncate">
          databaseURL: https://agrosmart-iot-default-rtdb.firebaseio.com
        </div>
      </div>

      {/* Founders & Ethical Perspective */}
      <div className="bg-gradient-to-br from-[#1b4332] via-[#245840] to-[#2d6a4f] text-white rounded-3xl p-5 shadow-sm border border-emerald-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-amber-300" />
            <h3 className="text-sm font-bold text-white">Founders & Perspective</h3>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-200 border border-white/20">
            5 Founders
          </span>
        </div>

        <p className="text-xs text-emerald-100/90 leading-relaxed">
          Founded by <strong>Ayush Gautam</strong>, <strong>Ranvijay</strong>, <strong>Rishabh</strong>, <strong>Jagrav</strong>, and <strong>Aayush Chaubey</strong> with a shared dedication to ecological morality, democratic technology, and living soil reverence.
        </p>

        <button
          onClick={() => onNavigateToTab?.('founders')}
          className="w-full flex items-center justify-between bg-white/15 hover:bg-white/25 text-white py-2.5 px-4 rounded-2xl text-xs font-bold transition active:scale-95 border border-white/20"
        >
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-rose-300" />
            <span>Meet the Founders & Read Morality</span>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-200" />
        </button>
      </div>

      {/* About Application */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl overflow-hidden mx-auto shadow-md">
          <img
            src="/src/assets/images/agrosmart_brand_logo_1793772055945.jpg"
            alt="AgroSmart"
            className="w-full h-full object-cover"
          />
        </div>
        <h4 className="text-sm font-extrabold text-slate-900">AgroSmart Mobile System</h4>
        <p className="text-xs text-[#1b4332] font-bold uppercase tracking-wider">
          "Grow Smarter, Live Greener."
        </p>
        <p className="text-[11px] text-slate-400">
          Native IoT Horticulture Platform · Production Release v1.2.0
        </p>
      </div>

      {/* Modal: Wiring Diagram */}
      {activeModal === 'wiring' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full max-h-[85vh] rounded-3xl p-5 shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-3">
              <h3 className="text-sm font-bold text-slate-900">ESP32 Hardware Pinout & Wiring</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <Check className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p className="leading-relaxed">
                Connect sensors to the following ESP32 pins. Use only <strong>ADC1</strong> channels (GPIO 32-39) because ADC2 is shared with Wi-Fi circuitry.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-sans">
                      <th className="py-1.5">Sensor</th>
                      <th className="py-1.5">Pin</th>
                      <th className="py-1.5">ESP32 GPIO</th>
                      <th className="py-1.5">Power</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-1.5 font-bold font-sans">Capacitive Moisture</td>
                      <td>AOUT</td>
                      <td className="text-emerald-700 font-bold">GPIO 34 (ADC1)</td>
                      <td>3.3V / GND</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold font-sans">DHT22 Temp & Hum</td>
                      <td>DATA</td>
                      <td className="text-emerald-700 font-bold">GPIO 4 (10kΩ pull-up)</td>
                      <td>3.3V / GND</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold font-sans">Analog pH Sensor</td>
                      <td>AOUT</td>
                      <td className="text-emerald-700 font-bold">GPIO 35 (ADC1)</td>
                      <td>5V / GND</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold font-sans">Analog EC Sensor</td>
                      <td>AOUT</td>
                      <td className="text-emerald-700 font-bold">GPIO 32 (ADC1)</td>
                      <td>5V / GND</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold font-sans">MAX485 (NPK)</td>
                      <td>RO / DI / DE</td>
                      <td className="text-emerald-700 font-bold">GPIO 16 / 17 / 5</td>
                      <td>5V / GND</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold font-sans">Pump Relay (Active Low)</td>
                      <td>IN</td>
                      <td className="text-rose-700 font-bold">GPIO 19</td>
                      <td>5V / GND</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-amber-900 text-[11px]">
                <strong>Safety Rule:</strong> Never connect a 12V pump motor directly to ESP32 pins. Route the positive motor lead through the Relay COM and NO terminals. Include a 1N4007 flyback diode across pump terminals.
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="mt-4 w-full bg-[#1b4332] text-white py-2.5 rounded-xl font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Modal: Arduino Firmware */}
      {activeModal === 'firmware' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full max-h-[85vh] rounded-3xl p-5 shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-3">
              <h3 className="text-sm font-bold text-slate-900">ESP32 Arduino Firmware (C++)</h3>
              <button
                onClick={copyFirmware}
                className="flex items-center space-x-1 text-xs font-bold text-[#1b4332] bg-emerald-50 px-2.5 py-1 rounded-lg"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="bg-slate-900 text-emerald-400 p-4 rounded-2xl text-[10px] font-mono overflow-x-auto leading-relaxed max-h-96">
{`#include <WiFi.h>
#include <FirebaseESP32.h>
#include <DHT.h>

#define WIFI_SSID       "YOUR_SSID"
#define WIFI_PASSWORD   "YOUR_PASS"
#define FIREBASE_HOST   "https://agrosmart-iot-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH   "DATABASE_SECRET"
#define USER_UID        "USER_UID_123"
#define DEVICE_ID       "ESP32_AGRO_01"

#define PIN_SOIL_MOISTURE 34
#define PIN_PUMP_RELAY    19
#define PIN_PH_SENSOR     35
#define PIN_EC_SENSOR     32
#define DHTPIN            4
#define DHTTYPE           DHT22

DHT dht(DHTPIN, DHTTYPE);
FirebaseData fbdoStream, fbdoWrite;
bool pumpRequested = false;
bool pumpActual = false;

void setup() {
  Serial.begin(115200);
  pinMode(PIN_PUMP_RELAY, OUTPUT);
  digitalWrite(PIN_PUMP_RELAY, HIGH); // Failsafe OFF
  dht.begin();
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) delay(300);
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
}

void loop() {
  // Read sensors & upload every 5s
  float hum = dht.readHumidity();
  float temp = dht.readTemperature();
  int rawM = analogRead(PIN_SOIL_MOISTURE);
  float moist = map(rawM, 3200, 1350, 0, 100);
  moist = constrain(moist, 0, 100);

  FirebaseJson json;
  json.set("soilMoisture", moist);
  json.set("temperature", temp);
  json.set("humidity", hum);
  json.set("lastUpdated", (int)millis());
  Firebase.setJSON(fbdoWrite, "users/" + String(USER_UID) + "/devices/ESP32_AGRO_01/sensors", json);
  delay(5000);
}`}
            </pre>

            <button
              onClick={() => setActiveModal(null)}
              className="mt-4 w-full bg-[#1b4332] text-white py-2.5 rounded-xl font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal: Sensor Calibration */}
      {activeModal === 'calibration' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-3xl p-5 shadow-2xl flex flex-col">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Capacitive Moisture Calibration</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter raw 12-bit ADC values (0 - 4095) for dry air and submerged cup of water.
            </p>

            <form onSubmit={handleSaveCalibration} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Dry Air ADC (0% Moisture)</label>
                <input
                  type="number"
                  value={airValue}
                  onChange={(e) => setAirValue(Number(e.target.value))}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Submerged Cup ADC (100% Moisture)</label>
                <input
                  type="number"
                  value={waterValue}
                  onChange={(e) => setWaterValue(Number(e.target.value))}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 font-mono"
                />
              </div>

              {calibratedSuccess && (
                <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl text-center font-bold text-xs flex items-center justify-center space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Calibration Profile Saved</span>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#1b4332] text-white py-2.5 rounded-xl font-bold"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
