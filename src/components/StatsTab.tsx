import { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Flame, Calendar, CalendarDays, Award, Timer, CheckCircle, BarChart3, Activity } from 'lucide-react';
import { FocusSession, UserStats } from '../types';

interface StatsTabProps {
  stats: UserStats;
  sessions: FocusSession[];
}

export default function StatsTab({ stats, sessions }: StatsTabProps) {
  const [timePeriod, setTimePeriod] = useState<'weekly' | 'monthly'>('weekly');

  // Let's calculate actual stats from completed sessions
  const workSessionsOnly = sessions.filter((s) => s.type === 'work');
  const totalSessionsCount = workSessionsOnly.length;
  const totalNotesCount = workSessionsOnly.filter((s) => s.notes && s.notes !== 'Verimli bir seans daha tamamlandı!').length;

  // Weekly focus hours chart data (Image 3.5)
  const weeklyFocusHours = [
    { day: 'Pzt', hours: 5.8, sessions: 3 },
    { day: 'Sal', hours: 6.2, sessions: 4 },
    { day: 'Çar', hours: 4.5, sessions: 2 },
    { day: 'Per', hours: 7.1, sessions: 5 },
    { day: 'Cum', hours: 8.0, sessions: 6 },
    { day: 'Cmt', hours: 3.2, sessions: 2 },
    { day: 'Paz', hours: Number((workSessionsOnly.reduce((sum, s) => sum + s.durationSeconds, 0) / 3600).toFixed(1)), sessions: totalSessionsCount }, // Active dynamic data from today's sessions!
  ];

  const totalWeeklyHours = Number(weeklyFocusHours.reduce((sum, item) => sum + item.hours, 0).toFixed(1));

  // Monthly focus hours (Image 3.5 monthly overview chart)
  const monthlyFocusData = [
    { week: 'Haf 1', hours: 31, rate: 82 },
    { week: 'Haf 2', hours: 36, rate: 90 },
    { week: 'Haf 3', hours: 34, rate: 85 },
    { week: 'Haf 4', hours: Math.round(totalWeeklyHours + 10), rate: 88 },
  ];

  // Completed Task Stats details
  const statsMetrics = [
    { title: 'Görev Başarımı', value: '88%', desc: 'Seans Hedefi', color: 'text-violet-400' },
    { title: 'Günlük Odak', value: '6.5 / 7 s', desc: 'Ortalama Süre', color: 'text-fuchsia-400' },
    { title: 'İstikrar', value: '7 / 7 gün', desc: 'Aktif Katılım', color: 'text-emerald-400' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 pb-20 space-y-5">
      {/* Tab Header */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-violet-400 font-mono tracking-widest uppercase">RAPORLAR & GRAFİKLER</span>
          <h2 className="text-xl font-display font-medium text-white tracking-tight">İlerleme İstatistikleri</h2>
        </div>

        {/* Period Selector Tabs */}
        <div className="bg-[#141220] p-1 rounded-xl flex border border-violet-500/10">
          <button
            onClick={() => setTimePeriod('weekly')}
            className={`text-[10px] uppercase font-mono px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              timePeriod === 'weekly' ? 'bg-violet-600 text-white font-semibold' : 'text-violet-300/40 hover:text-white'
            }`}
          >
            Haftalık
          </button>
          <button
            onClick={() => setTimePeriod('monthly')}
            className={`text-[10px] uppercase font-mono px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              timePeriod === 'monthly' ? 'bg-violet-600 text-white font-semibold' : 'text-violet-300/40 hover:text-white'
            }`}
          >
            Aylık
          </button>
        </div>
      </div>

      {/* Productivity Streak Box (Image 3.5: Productivity Streak 7 Days / Current/Best) */}
      <div className="bg-[#141220] border border-violet-500/10 p-4 rounded-2xl relative overflow-hidden flex items-center justify-between">
        <div className="absolute -right-4 -bottom-4 opacity-5">
          <Flame className="w-32 h-32 text-orange-500" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-violet-300/60 font-mono font-semibold tracking-wider uppercase block">
            Verimlilik Serisi (Productivity Streak)
          </span>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-black text-white">{stats.streak}</span>
            <span className="text-xs text-orange-400 font-semibold uppercase font-mono tracking-wider">Günlük Seri</span>
          </div>

          <p className="text-[10px] text-violet-300/40 font-mono">
            En yüksek serin: <strong className="text-emerald-400">{stats.bestStreak} gün</strong>
          </p>
        </div>

        {/* Big orange badge icon */}
        <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center text-orange-500 shadow-md">
          <Flame className="w-7 h-7 fill-orange-500 animate-pulse" />
        </div>
      </div>

      {/* Main Focus Hours Chart Panel (Image 3.5: Weekly Focus Hours 34.7 h) */}
      {timePeriod === 'weekly' ? (
        <div className="bg-[#141220] border border-violet-500/10 p-4 rounded-2xl">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-[10px] text-violet-300/60 font-mono font-semibold uppercase tracking-wider block">
                Haftalık Toplam Odaklanma
              </span>
              <h3 className="text-xl font-display font-bold text-white mt-0.5">
                {totalWeeklyHours} <span className="text-xs text-violet-400 font-normal">Saat</span>
              </h3>
            </div>
            <div className="bg-violet-500/10 px-2.5 py-1 rounded-lg text-[10px] font-mono text-violet-300 border border-violet-500/20">
              Ort: {(totalWeeklyHours / 7).toFixed(1)} sa/gün
            </div>
          </div>

          {/* Vertical Bar Chart (Image 3.5 style) */}
          <div className="h-36 flex items-end justify-between pt-6 px-1">
            {weeklyFocusHours.map((item, index) => {
              const maxHours = Math.max(...weeklyFocusHours.map((h) => h.hours), 1);
              const barHeightPercent = Math.max(8, (item.hours / maxHours) * 85);

              return (
                <div key={index} className="flex flex-col items-center flex-1 space-y-1.5 group select-none">
                  {/* Hours tooltip on top of hover */}
                  <span className="text-[9px] font-mono font-semibold text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.hours}s
                  </span>

                  {/* Glass column */}
                  <div className="relative w-4 bg-violet-950/20 rounded-t-lg h-24 flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${barHeightPercent}%` }}
                      transition={{ duration: 0.8, delay: index * 0.05 }}
                      className={`w-full rounded-t-lg relative ${
                        index === 6
                          ? 'bg-gradient-to-t from-orange-500 via-violet-600 to-fuchsia-400'
                          : 'bg-gradient-to-t from-violet-600 to-fuchsia-500'
                      }`}
                    >
                      {/* Gloss header shine inside bar */}
                      <div className="absolute top-0.5 inset-x-0.5 h-1 bg-white/20 rounded-full"></div>
                    </motion.div>
                  </div>

                  {/* Day Label */}
                  <span className={`text-[10px] font-mono mt-1 ${index === 6 ? 'text-fuchsia-400 font-semibold' : 'text-violet-300/40'}`}>
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Monthly focus hours overview area graph (Image 3.5: Monthly Focus Overview) */
        <div className="bg-[#141220] border border-violet-500/10 p-4 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] text-violet-300/60 font-mono font-semibold uppercase tracking-wider block">
                Aylık Odaklanma Eğilimi
              </span>
              <h3 className="text-xl font-display font-bold text-white mt-0.5">
                {monthlyFocusData.reduce((sum, w) => sum + w.hours, 0)} <span className="text-xs text-violet-400 font-normal">Saat</span>
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              %14 Artış
            </span>
          </div>

          {/* SVG Area Line Chart mimicking the curved line in Image 3.5 */}
          <div className="h-32 w-full pt-4 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
              {/* Chart Gradients */}
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area path */}
              <path
                d="M 0,38 L 0,25 Q 15,10 33,20 Q 50,5 66,22 T 100,12 L 100,40 Z"
                fill="url(#areaGradient)"
              />

              {/* Line curves path */}
              <path
                d="M 0,25 Q 15,10 33,20 Q 50,5 66,22 T 100,12"
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </svg>

            {/* Absolute positioning dots for labeling */}
            <div className="absolute inset-x-0 bottom-0 flex justify-between text-[9px] font-mono text-violet-300/40">
              {monthlyFocusData.map((w, j) => (
                <div key={j} className="flex flex-col items-center">
                  <span className="font-semibold text-violet-200">{w.hours}sa</span>
                  <span>{w.week}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Completed Tasks Stats Panel (Image 3.5 bottom section: Completed Tasks Stats) */}
      <div className="bg-[#141220] border border-violet-500/10 p-4 rounded-2xl">
        <h4 className="text-xs font-mono text-violet-300/60 font-semibold uppercase tracking-wider mb-3">
          Tamamlanan Görev Değerlendirmesi
        </h4>

        <div className="grid grid-cols-3 gap-2.5">
          {statsMetrics.map((item, key) => (
            <div key={key} className="bg-white/3 border border-violet-500/5 rounded-xl p-2.5 text-center flex flex-col justify-between">
              <span className="text-[9px] text-violet-300/40 font-semibold tracking-tight uppercase leading-snug">
                {item.title}
              </span>
              <div className="my-1.5">
                <span className={`text-[13px] font-display font-extrabold ${item.color}`}>
                  {item.value}
                </span>
              </div>
              <span className="text-[9px] text-violet-300/50 font-mono">
                {item.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* focus sessions history list */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 pb-1">
          <Activity className="w-4 h-4 text-violet-400" />
          <h3 className="text-xs font-mono text-violet-200 uppercase font-semibold">Odaklanma Günlüğü</h3>
        </div>

        {sessions.length === 0 ? (
          <p className="text-xs text-violet-300/40 text-center py-4 font-mono">Henüz kaydedilmiş odaklanma seansı yok.</p>
        ) : (
          <div className="space-y-2">
            {sessions.slice(0, 5).map((session, sidx) => (
              <div key={session.id || sidx} className="bg-[#141220]/50 border border-violet-500/5 p-3 rounded-xl flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white truncate max-w-[150px]">🎯 {session.taskTitle}</span>
                  <span className="text-[9px] font-mono text-violet-300/40">
                    {session.date} • {session.completedAt}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.2 rounded-md text-violet-300 uppercase">
                    {session.type === 'work' ? 'Çalışma' : 'Mola'}
                  </span>
                  <span className="text-[10px] text-violet-200/60 font-mono">
                    Süre: {Math.round(session.durationSeconds / 60)} dk
                  </span>
                </div>

                {session.notes && (
                  <p className="text-[11px] text-violet-300/70 italic border-l-2 border-violet-500/30 pl-2 mt-0.5 leading-snug">
                    "{session.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
