import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, Battery, Signal, Zap, Info, Smartphone, Eye, Monitor, Settings, RefreshCw } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onReset: () => void;
}

export default function MobileFrame({
  children,
  activeTab,
  onTabChange,
  onReset,
}: MobileFrameProps) {
  // Simulator frame toggle
  const [useDeviceFrame, setUseDeviceFrame] = useState(true);

  // Time mock matching phone
  const [systime, setSystime] = useState('10:09');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let h = now.getHours().toString().padStart(2, '0');
      let m = now.getMinutes().toString().padStart(2, '0');
      setSystime(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#08070d] flex items-center justify-center p-2 sm:p-4 text-violet-200 antialiased overflow-x-hidden">
      {/* Absolute background stars decoration */}
      <div className="absolute inset-0 bg-[#08070d] opacity-90 -z-20"></div>
      <div className="absolute top-10 left-10 w-96 h-96 bg-violet-900/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-fuchsia-900/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Main split dashboard layout */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side: Real-time Developer Manual and Specifications info panel */}
        <div className="lg:col-span-5 space-y-4 text-left xl:pr-6 px-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-violet-600/20 text-violet-300 font-mono font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider border border-violet-500/20 shadow-sm">
              Android-RN Protokolü
            </span>
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          </div>

          <h1 className="text-3xl font-display font-black text-white tracking-tight leading-none">
            Adım Adım <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 font-normal">Mobil</span>
          </h1>

          <p className="text-sm text-violet-200/60 leading-relaxed font-sans">
            Ankara Üniversitesi BLM 4538 Projesi için hazırlanan <strong>Adım Adım</strong> uygulaması, öğrencilerin ders ve çalışma faaliyetlerine verimli şekilde odaklanmasını sağlayan interaktif ve eğlenceli bir mobil araçtır.
          </p>

          <div className="bg-[#100e1a]/80 border border-violet-500/15 p-4 rounded-xl space-y-3.5 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-violet-500/15 flex items-center justify-center text-violet-300 font-bold shrink-0 text-[10px]">1</div>
              <p className="text-violet-200/80 leading-relaxed">
                <strong>Zamanlayıcı & Mola Sistemi:</strong> Pomodoro metodunu kullanarak isterseniz 25 dakikalık standart döngüyü isterseniz ⚡ testi başlatıp sonuçları test edebilirsiniz.
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-violet-500/15 flex items-center justify-center text-violet-300 font-bold shrink-0 text-[10px]">2</div>
              <p className="text-violet-200/80 leading-relaxed">
                <strong>İnteraktif Not Alma:</strong> Zamanlayıcı çalışırken dilediğiniz gibi seans notu (Image 3.4) tutun. Tamamlanınca ilgili kayıtlara eklenecektir.
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-violet-500/15 flex items-center justify-center text-violet-300 font-bold shrink-0 text-[10px]">3</div>
              <p className="text-violet-200/80 leading-relaxed">
                <strong>Oyunlaştırma & Profil:</strong> Odaklandıkça ve görev bitirdikçe XP kazanın, seviye atlayın ve "Streak Master" gibi özel rozetleri açın!
              </p>
            </div>
          </div>

          {/* Device toggle panel controls */}
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <button
              onClick={() => setUseDeviceFrame(!useDeviceFrame)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-violet-500/15 hover:bg-violet-500/25 active:bg-violet-500/35 border border-violet-500/20 text-violet-200 cursor-pointer transition-colors"
            >
              {useDeviceFrame ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>Tam Ekran Moduna Geç</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-violet-400" />
                  <span>Simülatör Çerçevesini Aç</span>
                </>
              )}
            </button>

            <button
              onClick={onReset}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs bg-[#1a0e1b] hover:bg-[#28132b] text-fuchsia-300 border border-fuchsia-500/20 cursor-pointer transition-colors"
              title="İlk varsayılan verileri yükler"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sıfırla</span>
            </button>
          </div>

          <p className="text-[10px] text-violet-300/30 text-left font-mono">
            * Simülatör, Android / Expo (Image 3.1-3.6) şablonundaki felsefe ile uyumludur.
          </p>
        </div>

        {/* Right Side: Smartphone Device Frame or Full Screen rendering */}
        <div className="lg:col-span-7 flex justify-center">
          <div
            className={`transition-all duration-300 ${
              useDeviceFrame
                ? 'w-full max-w-[360px] h-[720px] bg-[#0c0a13] rounded-[40px] border-[10px] border-[#1d1b30] shadow-[0_0_40px_rgba(139,92,246,0.15)] flex flex-col overflow-hidden relative'
                : 'w-full max-w-[420px] h-[740px] bg-[#0c0a13] rounded-3xl border border-violet-500/10 shadow-lg flex flex-col overflow-hidden relative'
            }`}
          >
            {/* Top Bar for Simulator (Android specific) */}
            <div className="bg-[#0c0a13] h-10 px-6 pt-2 select-none flex items-center justify-between z-40 relative">
              {/* Device hour */}
              <div className="text-xs font-mono font-medium text-white">{systime}</div>

              {/* Dynamic Island style center bar spacer for premium phones */}
              {useDeviceFrame && (
                <div className="w-20 h-4 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-2 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-violet-950 rounded-full absolute right-3"></div>
                </div>
              )}

              {/* System icons (battery wifi signal) */}
              <div className="flex items-center gap-1 text-white/80">
                <Signal className="w-3 h-3 text-white/50" />
                <Wifi className="w-3 h-3 text-white/60" />
                <div className="flex items-center gap-0.5 text-[9px] font-mono pl-1 text-white/70">
                  <Battery className="w-4 h-3.5" />
                  <span>%85</span>
                </div>
              </div>
            </div>

            {/* Inner responsive display screen containing stateful content */}
            <div className="flex-1 overflow-hidden relative flex flex-col bg-[#0c0a13]">
              {children}
            </div>

            {/* Simulated Android Software Home line Navigation Bar */}
            {useDeviceFrame && (
              <div className="bg-[#0c0a13] h-4 pb-2 flex items-center justify-center select-none z-40">
                <div className="w-28 h-1 bg-white/20 rounded-full"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
