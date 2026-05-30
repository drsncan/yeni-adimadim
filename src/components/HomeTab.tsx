import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Play, Pause, Music, Settings, Plus, Trash2, Check, Sparkles, Timer, ClipboardList } from 'lucide-react';
import { Task, FocusSession, UserStats } from '../types';

interface HomeTabProps {
  stats: UserStats;
  tasks: Task[];
  sessions: FocusSession[];
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addTask: (title: string, category: string) => void;
  onNavigateToFocus: (preselectedTask?: string) => void;
}

export default function HomeTab({
  stats,
  tasks,
  sessions,
  toggleTask,
  deleteTask,
  addTask,
  onNavigateToFocus,
}: HomeTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Ders Çalışma');

  const categories = ['Kodlama', 'Matematik', 'UI/UX Tasarım', 'Ders Çalışma', 'Kitap Okuma', 'Dışarıda', 'Genel'];

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Let's create mock weekly completions for the bar chart
  const weeklyData = [
    { day: 'Pzt', completed: 4 },
    { day: 'Sal', completed: 6 },
    { day: 'Çar', completed: 3 },
    { day: 'Per', completed: 7 },
    { day: 'Cum', completed: 8 },
    { day: 'Cmt', completed: 4 },
    { day: 'Paz', completed: completedCount }, // reactive to today's completed tasks!
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle.trim(), newTaskCategory);
    setNewTaskTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 pb-20 space-y-5">
      {/* App Header & Brand */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          {/* Logo Steps */}
          <div className="flex items-end gap-1">
            <div className="w-2 h-4 bg-violet-500/50 rounded-t-xs"></div>
            <div className="w-2 h-6 bg-violet-400/80 rounded-t-xs"></div>
            <div className="w-2 h-8 bg-gradient-to-t from-violet-500 to-fuchsia-400 rounded-t-xs"></div>
          </div>
          <span className="text-xl font-display font-bold text-white tracking-tight">Adım Adım</span>
        </div>
        <div className="flex items-center gap-1 bg-violet-500/10 px-2.5 py-1 rounded-full text-xs font-mono text-violet-300 font-semibold border border-violet-500/20">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>XP: {stats.xp}</span>
        </div>
      </div>

      {/* Hero cards row (Streak and Completion wheel) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Streak card (Image 3.2: Current Streak: 7 Days) */}
        <div className="bg-gradient-to-br from-violet-600/20 to-fuchsia-500/5 border border-violet-500/20 p-3 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-2 right-2 opacity-10">
            <Flame className="w-16 h-16 text-violet-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-orange-400 font-mono text-[10px] font-semibold tracking-wider uppercase mb-1">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <span>GÜNCEL SERİ</span>
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-0.5">{stats.streak} Gün</h3>
            <p className="text-[10px] text-violet-200/60 leading-tight">Yılmadan devam et, adım adım!</p>
          </div>
          {/* Progress bar inside card */}
          <div className="mt-3">
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                style={{ width: `${Math.min(100, (stats.streak / 30) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Completion Wheel card (Image 3.2: 65% completion) */}
        <div className="bg-violet-950/20 border border-violet-500/15 p-3 rounded-2xl flex items-center justify-between relative">
          <div className="flex flex-col justify-between h-full">
            <div>
              <span className="text-violet-300 font-mono text-[10px] font-semibold tracking-wider uppercase mb-1 block">TAMAMLAMA</span>
              <h3 className="text-xl font-display font-bold text-white mb-0.5">{completionPercentage}%</h3>
              <p className="text-[10px] text-violet-200/50 leading-tight">
                {completedCount}/{totalCount} Görev
              </p>
            </div>
            <span className="text-[9px] text-violet-300/40 font-mono mt-2 block">Günlük İlerleme</span>
          </div>

          {/* Radial SVG slider */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="28" cy="28" r="23" stroke="rgba(139, 92, 246, 0.08)" strokeWidth="4" fill="transparent" />
              <circle
                cx="28"
                cy="28"
                r="23"
                stroke="url(#completionGradient)"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={144.5}
                strokeDashoffset={144.5 - (144.5 * completionPercentage) / 100}
                className="transition-all duration-500"
              />
              <defs>
                <linearGradient id="completionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-display font-semibold text-white">
              {completionPercentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Focus Session Widget (Image 3.2: Focus Session panel) */}
      <div className="bg-gradient-to-b from-[#1c182c] to-[#141220] border border-violet-500/15 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-violet-400 font-mono text-[10px] font-semibold">
            <Timer className="w-3.5 h-3.5 text-violet-400" />
            <span>AKTİF ODAKLANMA OTURUMU</span>
          </div>
          <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md font-mono">
            Hazır
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white">Derin Çalışma Seansı</h4>
            <p className="text-[11px] text-violet-300/60 mt-0.5">
              Hedef: 25 Dakika • Pomodoro Modu
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Quick pre-select and trigger */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigateToFocus()}
              className="bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white rounded-full p-2.5 shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white pl-0.5" />
            </motion.button>
          </div>
        </div>

        {/* Music feedback & quick details (Pictured in Image 3.2: pause, music control, settings icons) */}
        <div className="flex items-center justify-between border-t border-violet-500/10 mt-3 pt-3 text-xs text-violet-200/50">
          <div className="flex items-center gap-1">
            <Music className="w-3.5 h-3.5" />
            <span className="text-[10px]">Lofi Focus Beat</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigateToFocus()} className="hover:text-violet-300 transition-colors cursor-pointer">
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Statistics (Weekly Overview Bar Chart - Image 3.2) */}
      <div className="bg-[#141220] border border-violet-500/10 p-4 rounded-2xl">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h4 className="text-xs font-mono text-violet-300/60 font-semibold uppercase tracking-wider">İlerleme İstatistikleri</h4>
            <h3 className="text-sm font-semibold text-white mt-0.5">Haftalık Genel Bakış</h3>
          </div>
          <span className="text-[10px] text-violet-400 hover:underline cursor-pointer">Detayları Gör</span>
        </div>

        {/* SVG Custom Bar Chart */}
        <div className="flex items-end justify-between h-24 pt-2">
          {weeklyData.map((data, index) => {
            const maxVal = Math.max(...weeklyData.map((d) => d.completed), 1);
            const percentHeight = Math.max(10, (data.completed / maxVal) * 80); // Ensure a minimal elegant visible bar

            return (
              <div key={index} className="flex flex-col items-center flex-1 space-y-2">
                {/* Bar */}
                <div className="relative w-3.5 bg-violet-950/40 rounded-full h-16 flex items-end overflow-visible">
                  {/* Glowing active day filter */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${percentHeight}%` }}
                    transition={{ duration: 0.8, delay: index * 0.05 }}
                    className={`w-full rounded-full ${
                      index === 6
                        ? 'bg-gradient-to-t from-fuchsia-500 to-violet-400 shadow-md shadow-fuchsia-500/30'
                        : 'bg-gradient-to-t from-violet-600/80 to-violet-400'
                    }`}
                  >
                    {/* Tiny tooltip indicator */}
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity bg-black text-[8px] text-white py-0.5 px-1 rounded shadow pointer-events-none">
                      {data.completed}
                    </div>
                  </motion.div>
                </div>
                {/* Day label */}
                <span className={`text-[10px] font-mono ${index === 6 ? 'text-fuchsia-400 font-bold' : 'text-violet-300/40'}`}>
                  {data.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tasks List section (Image 3.2: My Tasks with checkbox items and dynamic + button) */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-semibold text-white">Görevlerim</h3>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-white bg-violet-600 hover:bg-violet-500 rounded-full p-1 shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Expandable Task Add Module */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleCreateTask}
              className="bg-[#1b1929] border border-violet-500/20 p-3 rounded-2xl mb-3 space-y-3 overflow-hidden"
            >
              <div>
                <label className="block text-[10px] text-violet-300/60 font-mono tracking-wider uppercase mb-1">Görev Adı</label>
                <input
                  type="text"
                  placeholder="Yarınki matematik testi çalışması..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-[#141220] text-sm text-white placeholder-violet-300/30 border border-violet-500/20 rounded-xl px-3 py-2 outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-violet-300/60 font-mono tracking-wider uppercase mb-1">Kategori</label>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewTaskCategory(cat)}
                      className={`text-[10px] px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                        newTaskCategory === cat
                          ? 'bg-violet-600 text-white font-medium shadow-sm border border-violet-400/20'
                          : 'bg-white/5 text-violet-300/60 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-xs text-violet-300/50 hover:text-white cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-xs px-3 py-1.5 rounded-xl font-medium shadow-sm cursor-pointer"
                >
                  Görev Ekle
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Tasks List */}
        <div className="space-y-2 mt-1">
          {tasks.length === 0 ? (
            <div className="text-center py-8 bg-white/3 rounded-2xl border border-dashed border-violet-500/10">
              <p className="text-xs text-violet-300/40 font-mono">Hiç görev bulunmuyor.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-2 text-xs text-violet-400 hover:underline"
              >
                İlk görevini ekle
              </button>
            </div>
          ) : (
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="bg-[#141220]/75 hover:bg-[#181526]/75 border border-violet-500/5 hover:border-violet-500/15 p-3 rounded-xl flex items-center justify-between group transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0 pr-3">
                    {/* Standard Checkbox */}
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all cursor-pointer ${
                        task.completed
                          ? 'bg-violet-500 border-violet-400 text-white'
                          : 'border-violet-500/40 hover:border-violet-500 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>

                    <div className="min-w-0 flex-1">
                      <span
                        onClick={() => toggleTask(task.id)}
                        className={`text-xs block truncate transition-all cursor-pointer ${
                          task.completed ? 'line-through text-violet-300/30' : 'text-violet-200 hover:text-white'
                        }`}
                      >
                        {task.title}
                      </span>
                      <span className="text-[9px] font-mono text-violet-400/50 bg-violet-500/5 border border-violet-500/10 px-1.5 py-0.2 rounded-md uppercase tracking-wider inline-block mt-0.5">
                        {task.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Play session on this task */}
                    {!task.completed && (
                      <button
                        onClick={() => onNavigateToFocus(task.title)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-violet-300/40 hover:text-emerald-400 rounded-md cursor-pointer"
                        title="Oturum başlat"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-10 group-hover:opacity-100 text-violet-300/30 hover:text-rose-400 p-1.5 rounded-md transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
