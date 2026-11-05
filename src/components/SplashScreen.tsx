import React, { useEffect, useState } from 'react';
import { Sprout, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 400);
          return 100;
        }
        return prev + 18;
      });
    }, 180);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#0f281e] via-[#1b4332] to-[#2d6a4f] text-white flex flex-col justify-between p-6 select-none">
      {/* Top Tag */}
      <div className="flex justify-between items-center pt-safe">
        <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-300/80 bg-white/10 px-3 py-1 rounded-full border border-white/10">
          Precision Agriculture IoT
        </span>
        <button
          onClick={onFinish}
          className="text-xs font-semibold text-white/70 hover:text-white px-3 py-1 rounded-lg bg-white/10 active:scale-95 transition"
        >
          Skip
        </button>
      </div>

      {/* Center Brand Identity */}
      <div className="flex flex-col items-center text-center my-auto">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-3xl bg-emerald-400/20 absolute -inset-2 blur-xl animate-pulse" />
          <img
            src="/src/assets/images/agrosmart_brand_logo_1793772055945.jpg"
            alt="AgroSmart Emblem"
            className="w-28 h-28 rounded-3xl object-cover relative z-10 shadow-2xl border-2 border-emerald-400/40"
          />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          AgroSmart
        </h1>
        <p className="text-emerald-200 text-sm font-semibold tracking-wide uppercase">
          Grow Smarter, Live Greener.
        </p>

        <p className="text-xs text-emerald-100/70 max-w-xs mt-3 leading-relaxed">
          Autonomous ESP32 root-zone telemetry, soil pH & EC chemistry diagnostics, and closed-loop irrigation automation.
        </p>
      </div>

      {/* Bottom Progress Bar & Telemetry Init */}
      <div className="space-y-3 pb-safe">
        <div className="flex justify-between text-[11px] font-mono text-emerald-300/90">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            Initializing IoT Telemetry Bus...
          </span>
          <span>{progress}%</span>
        </div>

        <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-center pt-2">
          <span className="text-[10px] text-emerald-300/60 font-mono">
            Firmware v1.2.0 · ESP32-WROOM · Modbus RS485 Ready
          </span>
        </div>
      </div>
    </div>
  );
};
