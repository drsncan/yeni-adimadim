import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Music, Settings, PenTool, Sparkles, Check, ChevronDown, Bell, NotebookPen } from 'lucide-react';
import { Task } from '../types';

interface FocusTabProps {
  tasks: Task[];
  preselectedTaskTitle?: string;
  addFocusSession: (taskTitle: string, durationSeconds: number, targetSeconds: number, notes: string, type: 'work' | 'break') => void;
}

export default function FocusTab({
  tasks,
  preselectedTaskTitle = '',
  addFocusSession,
}: FocusTabProps) {
  // Configurable session settings
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [selectedTask, setSelectedTask] = useState(preselectedTaskTitle || 'Genel Odaklanma');
  const [sessionType, setSessionType] = useState<'work' | 'break'>('work');

  // Timer states
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [totalDuration, setTotalDuration] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  // In-session Note-Taking overlay state (Image 3.4)
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [sessionNote, setSessionNote] = useState('');

  // Audio simulator (since web browsers block auto-playing audio naturally, we simulate a lovely in-app notification chord)
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundTrack, setSoundTrack] = useState('Lofi Focus Beats');

  // Trigger effect when preselectedTaskTitle is changed via Home page click
  useEffect(() => {
    if (preselectedTaskTitle) {
      setSelectedTask(preselectedTaskTitle);
      // Auto configure timer to the preselected workMinutes if running
      if (!isRunning) {
        setTimeLeft(workMinutes * 60);
        setTotalDuration(workMinutes * 60);
      }
    }
  }, [preselectedTaskTitle, workMinutes]);

  // Timer runner Ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Effect to manage interval
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSessionCompleted();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // Quick preset updates when sliders are edited (and timer is not running)
  const handleWorkMinutesChange = (newMin: number) => {
    setWorkMinutes(newMin);
    if (!isRunning && sessionType === 'work') {
      setTimeLeft(newMin * 60);
      setTotalDuration(newMin * 60);
    }
  };

  const handleBreakMinutesChange = (newMin: number) => {
    setBreakMinutes(newMin);
    if (!isRunning && sessionType === 'break') {
      setTimeLeft(newMin * 60);
      setTotalDuration(newMin * 60);
    }
  };

  // Quick state presets for developers
  const applyQuickDemoPreset = () => {
    setIsRunning(false);
    setWorkMinutes(1); // Set to 10 seconds for instant developer-friendly testing!
    setBreakMinutes(1);
    setTimeLeft(10); // 10 seconds demo!
    setTotalDuration(10);
  };

  const resetTimer = () => {
    setIsRunning(false);
    const targetMin = sessionType === 'work' ? workMinutes : breakMinutes;
    setTimeLeft(targetMin * 60);
    setTotalDuration(targetMin * 60);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // Sound sound simulation trigger
  const playFinishChime = () => {
    if (!soundEnabled) return;
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = context.createOscillator();
      const gain = context.createGain();

      osc.connect(gain);
      gain.connect(context.destination);

      osc.type = 'sine';
      // Arpeggio chord sweep
      osc.frequency.setValueAtTime(523.25, context.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, context.currentTime + 0.15); // E5
      osc.frequency.setValueAtTime(783.99, context.currentTime + 0.3); // G5
      osc.frequency.setValueAtTime(1046.50, context.currentTime + 0.45); // C6

      gain.gain.setValueAtTime(0.3, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.9);

      osc.start(context.currentTime);
      osc.stop(context.currentTime + 0.9);
    } catch (e) {
      console.log('Audio chord failed or not allowed: ', e);
    }
  };

  const handleSessionCompleted = () => {
    playFinishChime();
    setIsRunning(false);

    // Save actual completed duration to the store
    const actualSecondsSpent = totalDuration;
    addFocusSession(
      selectedTask,
      actualSecondsSpent,
      totalDuration,
      sessionNote.trim() || 'Verimli bir seans daha tamamlandı!',
      sessionType
    );

    // Celebratory alert and type toggle
    alert(
      sessionType === 'work'
        ? `Tebrikler! 🎉 "${selectedTask}" odaklanma seansın bitti. Notların kaydedildi ve XP kazandın!`
        : 'Mola bitti! Kendini tazeledin mi? Şimdi tekrar çalışma zamanı! 💪'
    );

    // Swap work <-> break automatically
    if (sessionType === 'work') {
      setSessionType('break');
      setTimeLeft(breakMinutes * 60);
      setTotalDuration(breakMinutes * 60);
    } else {
      setSessionType('work');
      setTimeLeft(workMinutes * 60);
      setTotalDuration(workMinutes * 60);
    }

    // Reset notes
    setSessionNote('');
  };

  // Beautiful formatting: mm:ss
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Circular calculations for SVG
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const percentLeft = (timeLeft / totalDuration) * 100;
  const strokeDashoffset = circumference - (percentLeft / 100) * circumference;

  return (
    <div className="flex-1 flex flex-col justify-between overflow-y-auto px-4 pb-20 relative">
      {/* Background radial highlight */}
      <div className="absolute inset-x-0 top-1/4 -translate-y-1/2 h-80 bg-violet-600/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Panel */}
      <div className="flex items-center justify-between pt-4 pb-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-violet-400 font-mono tracking-widest uppercase">ZAMANLAYICI</span>
          <h2 className="text-lg font-display font-bold text-white">
            {sessionType === 'work' ? 'Odaklanma Seansı' : 'Kısa Yenilenme Molası'}
          </h2>
        </div>

        {/* Demo trigger helper */}
        <button
          onClick={applyQuickDemoPreset}
          className="text-[10px] font-mono select-none px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg cursor-pointer"
          title="Odaklanma seansını hızlıca denemek ve başarı ile bitirmek için tıklayın"
        >
          ⚡ Hızlı Test (10s)
        </button>
      </div>

      {/* Task Selector Selection */}
      <div className="bg-[#141220] border border-violet-500/10 px-3 py-2 rounded-xl flex items-center justify-between text-xs my-2">
        <span className="text-violet-300/60">GÖREV</span>
        <select
          value={selectedTask}
          onChange={(e) => setSelectedTask(e.target.value)}
          className="bg-transparent text-violet-200 outline-none font-medium text-right max-w-[180px] truncate cursor-pointer"
        >
          <option value="Genel Odaklanma" className="bg-[#141220]">✨ Genel Odaklanma</option>
          {tasks.filter((t) => !t.completed).map((t) => (
            <option key={t.id} value={t.title} className="bg-[#141220]">
              🎯 {t.title}
            </option>
          ))}
        </select>
      </div>

      {/* Outer Circle Timer Wrapper (Image 3.3 representation) */}
      <div className="flex flex-col items-center justify-center py-6 relative">
        <div className="relative w-56 h-56 flex items-center justify-center">
          {/* SVG ring */}
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle cx="112" cy="112" r={radius} stroke="rgba(139, 92, 246, 0.04)" strokeWidth="6" fill="transparent" />
            {/* Pulsing glow filter */}
            <circle
              cx="112"
              cy="112"
              r={radius}
              stroke={sessionType === 'work' ? '#8b5cf6' : '#10b981'}
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>

          {/* Centered Numbers */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-display font-light text-white tracking-widest tabular-nums leading-none">
              {formatTime(timeLeft)}
            </span>
            <span className={`text-[10px] font-mono tracking-widest mt-1.5 uppercase ${isRunning ? 'text-violet-400 animate-pulse' : 'text-violet-300/40'}`}>
              {isRunning ? 'ODAKLANILIYOR' : 'HAZIR / DURDURULDU'}
            </span>
          </div>

          {/* Glowing dot tracking remaining time */}
          {isRunning && (
            <div className="absolute inset-0 pointer-events-none rounded-full glow-active"></div>
          )}
        </div>
      </div>

      {/* Control Actions Panel (Image 3.3 button grid: play, pause, reset, music selectors) */}
      <div className="flex justify-center items-center gap-6 my-4">
        {/* Reset */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={resetTimer}
          className="w-11 h-11 rounded-full bg-violet-950/20 hover:bg-violet-950/40 border border-violet-500/20 flex items-center justify-center text-violet-300 transition-colors shadow-inner cursor-pointer"
          title="Sıfırla"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>

        {/* Play/Pause Main */}
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={toggleTimer}
          className={`w-18 h-18 rounded-full flex items-center justify-center shadow-lg shadow-violet-600/20 transition-all cursor-pointer ${
            isRunning
              ? 'bg-amber-600/90 text-white border border-amber-400/30'
              : 'bg-violet-600 text-white border border-violet-400/40'
          }`}
        >
          {isRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 fill-white translate-x-0.5" />}
        </motion.button>

        {/* Note-Taking Overlay Trigger (Pictured in Image 3.4) */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsNoteOpen(true)}
          className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
            sessionNote.trim()
              ? 'bg-emerald-950/30 border-emerald-500/55 text-emerald-400'
              : 'bg-violet-950/20 border-violet-500/20 text-violet-300'
          }`}
          title="Odaklanırken Not Defteri Aç"
        >
          <NotebookPen className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Configure Sliders Section (When paused) */}
      <AnimatePresence>
        {!isRunning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#141220] border border-violet-500/5 p-4 rounded-2xl space-y-4"
          >
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-white">Süre Ayarları</span>
              <span className="text-[10px] font-mono text-violet-300/40">Zamanlayıcıyı Ayarlayın</span>
            </div>

            {/* Çalışma Süresi */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-violet-300/60">Çalışma Süresi</span>
                <span className="font-mono text-violet-400 font-semibold">{workMinutes} Dakika</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={workMinutes}
                onChange={(e) => handleWorkMinutesChange(Number(e.target.value))}
                className="w-full accent-violet-500 bg-violet-950/30 rounded-lg cursor-pointer h-1.5"
              />
            </div>

            {/* Mola Süresi */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-violet-300/60">Mola Süresi</span>
                <span className="font-mono text-emerald-400 font-semibold">{breakMinutes} Dakika</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={breakMinutes}
                onChange={(e) => handleBreakMinutesChange(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-violet-950/30 rounded-lg cursor-pointer h-1.5"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sound Settings & Soundscapes (Exactly as Image 3.3) */}
      <div className="bg-[#141220]/50 border border-violet-500/5 p-3 rounded-xl mt-2 flex items-center justify-between text-xs text-violet-300/60">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-violet-400" />
          <span>Müzik: {soundTrack}</span>
        </div>
        <select
          value={soundTrack}
          onChange={(e) => setSoundTrack(e.target.value)}
          className="bg-transparent text-white outline-none border-none py-1 text-right text-[11px] font-mono cursor-pointer"
        >
          <option value="Lofi Focus Beats" className="bg-[#141220]">🎵 Lofi Focus Beats</option>
          <option value="Yağmur & Fırtına" className="bg-[#141220]">⛈️ Yağmur & Fırtına</option>
          <option value="Derin Orman Sesi" className="bg-[#141220]">🌲 Derin Orman Sesi</option>
          <option value="Beyaz Gürültü (ASMR)" className="bg-[#141220]">⚡ Beyaz Gürültü</option>
          <option value="Müzik Kapalı" className="bg-[#141220]">🔇 Müzik Kapalı</option>
        </select>
      </div>

      {/* Dynamic Note-Taking Interactive Drawer Overlay Sheet (Styling representing Image 3.4) */}
      <AnimatePresence>
        {isNoteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#0f0d15]/95 p-5 flex flex-col justify-between"
          >
            {/* Header of Note Sheet */}
            <div className="flex justify-between items-center pb-3 border-b border-violet-500/10">
              <div className="flex flex-col">
                <span className="text-[9px] text-violet-400 font-mono uppercase tracking-wider">ODAK NOT DEFFTERİ</span>
                <h3 className="text-sm font-semibold text-white">Seans Notları Alın</h3>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsNoteOpen(false)}
                className="text-xs text-violet-300 hover:text-white bg-violet-500/10 hover:bg-violet-500/20 px-3 py-1.5 rounded-lg cursor-pointer"
              >
                Kapat
              </motion.button>
            </div>

            {/* Note taking text area (Styled as a stylish legal notepad lined grid paper - Image 3.4) */}
            <div className="flex-1 my-4 flex flex-col">
              <span className="text-[10px] text-violet-400/60 font-mono mb-2">Seçili Görev: "{selectedTask}"</span>
              <div className="flex-1 bg-[#1c1a2e] border border-violet-500/25 rounded-2xl p-4 flex flex-col overflow-hidden relative shadow-inner">
                {/* Visual paper lines */}
                <div className="absolute inset-0 bg-notebook opacity-[0.03] pointer-events-none"></div>

                <textarea
                  className="w-full flex-1 bg-transparent text-sm text-violet-100 placeholder-violet-300/30 outline-none resize-none font-sans leading-relaxed relative z-10"
                  placeholder="Seans sırasında aklına gelen fikirleri, çıkarımları ve planları adım adım buraya not edebilirsin...&#10;&#10;Örnek:&#10;• Önemli Çıkarım: Dikkat dağıtıcıları azalt.&#10;• Araştırma: Yeni UI modelleri keşfet.&#10;• Plan: Zamanlayıcı arayüzünü tamamla."
                  value={sessionNote}
                  onChange={(e) => setSessionNote(e.target.value)}
                />

                {/* Character index and draft indicator */}
                <div className="flex justify-between items-center text-[10px] text-violet-400/40 font-mono pt-2 border-t border-violet-500/10">
                  <span>Adım Adım Defteri • {sessionNote.length} karakter</span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-heartbeat"></span>
                    Kaydedilmeye Hazır
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Keyboard Input controls */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSessionNote((prev) => prev + '\n• Önemli Çıkarım: ')}
                  className="bg-white/5 hover:bg-white/10 text-violet-300 text-[10px] px-2.5 py-1.5 rounded-lg border border-violet-500/10 cursor-pointer"
                >
                  + Çıkarım Ekle
                </button>
                <button
                  type="button"
                  onClick={() => setSessionNote((prev) => prev + '\n• Plan: ')}
                  className="bg-white/5 hover:bg-white/10 text-violet-300 text-[10px] px-2.5 py-1.5 rounded-lg border border-violet-500/10 cursor-pointer"
                >
                  + Plan Ekle
                </button>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsNoteOpen(false)}
                className="w-full bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Notları Oturuma İlişkilendir</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
