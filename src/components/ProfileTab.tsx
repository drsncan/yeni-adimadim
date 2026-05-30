import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Flame, Clock, Target, Calendar, User, Edit3, Settings2, Trash2, Shield, Compass, Gem, CheckCircle, RefreshCcw, Smile } from 'lucide-react';
import { AchievementBadge, UserStats } from '../types';

interface ProfileTabProps {
  userName: string;
  userTitle: string;
  stats: UserStats;
  badges: AchievementBadge[];
  editProfile: (name: string, title: string) => void;
  resetAllData: () => void;
}

export default function ProfileTab({
  userName,
  userTitle,
  stats,
  badges,
  editProfile,
  resetAllData,
}: ProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const [titleInput, setTitleInput] = useState(userTitle);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    editProfile(nameInput.trim(), titleInput.trim() || 'Focus Adept');
    setIsEditing(false);
  };

  // Helper to resolve icon name to React component
  const renderBadgeIcon = (iconName: string, colorClass: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className={`w-5 h-5 ${colorClass}`} />;
      case 'Shield':
        return <Shield className={`w-5 h-5 ${colorClass}`} />;
      case 'Target':
        return <Target className={`w-5 h-5 ${colorClass}`} />;
      case 'Clock':
        return <Clock className={`w-5 h-5 ${colorClass}`} />;
      case 'Compass':
        return <Compass className={`w-5 h-5 ${colorClass}`} />;
      case 'Gem':
        return <Gem className={`w-5 h-5 ${colorClass}`} />;
      default:
        return <Award className={`w-5 h-5 ${colorClass}`} />;
    }
  };

  // Resolve Badge color scheme
  const getBadgeColors = (badge: AchievementBadge) => {
    if (!badge.unlocked) {
      return {
        bg: 'bg-white/3 border-white/5 opacity-40 grayscale',
        text: 'text-violet-300/40',
        glow: '',
      };
    }
    switch (badge.id) {
      case 'b1': // Streak Master
        return { bg: 'bg-orange-500/10 border-orange-500/20', text: 'text-orange-400', glow: 'shadow-orange-500/10' };
      case 'b2': // Focus Hero
        return { bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-400', glow: 'shadow-blue-500/10' };
      case 'b3': // Goal Setter
        return { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400', glow: 'shadow-emerald-500/10' };
      case 'b4': // Time Wizard
        return { bg: 'bg-fuchsia-500/10 border-fuchsia-500/20', text: 'text-fuchsia-400', glow: 'shadow-fuchsia-500/10' };
      case 'b5': // Early Bird
        return { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400', glow: 'shadow-amber-500/10' };
      default:
        return { bg: 'bg-violet-500/10 border-violet-500/20', text: 'text-violet-400', glow: 'shadow-violet-500/10' };
    }
  };

  // Interactive profile reset double-check
  const [resetConfirm, setResetConfirm] = useState(false);
  const triggerReset = () => {
    if (resetConfirm) {
      resetAllData();
      setResetConfirm(false);
      alert('Uygulama verileri başarıyla sıfırlandı ve varsayılana döndürüldü.');
    } else {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 5000); // 5 sec expiration
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 pb-20 space-y-5">
      {/* Tab Header with Edit button (Image 3.6 Edit Profile / Settings gears) */}
      <div className="flex justify-between items-center pt-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-violet-400 font-mono tracking-widest uppercase font-semibold">
            PROFİL PANORAMASI
          </span>
          <h2 className="text-xl font-display font-medium text-white tracking-tight">Profil</h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 hover:bg-white/5 text-violet-300 rounded-lg transition-colors cursor-pointer"
            title="Profili Düzenle"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Profile main component presentation (Image 3.6 representation) */}
      <div className="bg-[#141220] border border-violet-500/10 p-4 rounded-2xl relative">
        <div className="flex flex-col items-center text-center">
          {/* Circular avatar with gradient glowing border */}
          <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
            {/* Pulsing ring glowing background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-emerald-500 rounded-full animate-spin-slow opacity-80 blur-xs"></div>
            {/* Avatar fill */}
            <div className="absolute inset-0.5 bg-[#0f0d15] rounded-full flex items-center justify-center text-violet-300">
              {/* Initials/Smile placeholder */}
              <span className="font-display font-bold text-lg tracking-tight uppercase">
                {userName.substring(0, 2)}
              </span>
            </div>
            {/* Level label badge overlay */}
            <div className="absolute -bottom-1 right-0 bg-violet-600 border border-violet-400/40 text-white rounded-full text-[9px] font-mono px-2 py-0.5 shadow-md">
              Lvl {stats.level}
            </div>
          </div>

          {/* Edit Profile Form Inline toggle */}
          {isEditing ? (
            <form onSubmit={handleSave} className="w-full space-y-2 mt-2">
              <input
                type="text"
                placeholder="İsim soyisim"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-[#1c1a2e] text-xs text-center font-bold text-white border border-violet-500/20 rounded-lg px-2.5 py-1.5 outline-none focus:border-violet-500"
                required
              />
              <input
                type="text"
                placeholder="Ünvan (örn. Derin Odaklanmacı)"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="w-full bg-[#1c1a2e] text-xs text-center text-violet-300/80 border border-violet-500/20 rounded-lg px-2.5 py-1 text-outline focus:border-violet-500"
              />
              <div className="flex justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-white/5 hover:bg-white/10 text-violet-300 text-[10px] px-2.5 py-1.2 rounded-md cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-500 text-white text-[10px] px-3 py-1.2 rounded-md font-semibold cursor-pointer"
                >
                  Kaydet
                </button>
              </div>
            </form>
          ) : (
            <div>
              <h3 className="text-base font-display font-bold text-white tracking-tight flex items-center justify-center gap-1">
                {userName}
              </h3>
              <p className="text-[11px] font-mono font-semibold text-violet-400 mt-0.5">
                {userTitle}
              </p>
            </div>
          )}
        </div>

        {/* Stats segment summary grid (Image 3.6: streak, total focus time, completed tasks) */}
        <div className="grid grid-cols-3 gap-2 border-t border-violet-500/10 mt-4 pt-4">
          <div className="text-center">
            <span className="text-[9px] text-violet-300/40 uppercase font-mono font-semibold block leading-tight">
              REKOR SERİ
            </span>
            <span className="text-xs font-display font-medium text-amber-300 block mt-0.5">
              {stats.bestStreak} Gün
            </span>
          </div>

          <div className="text-center border-x border-violet-500/10">
            <span className="text-[9px] text-violet-300/40 uppercase font-mono font-semibold block leading-tight">
              TOPLAM ODAK
            </span>
            <span className="text-xs font-display font-medium text-violet-200 block mt-0.5">
              {stats.totalFocusTime} Sa
            </span>
          </div>

          <div className="text-center">
            <span className="text-[9px] text-violet-300/40 uppercase font-mono font-semibold block leading-tight">
              BİTEN GÖREV
            </span>
            <span className="text-xs font-display font-medium text-emerald-400 block mt-0.5">
              752 + 
            </span>
          </div>
        </div>
      </div>

      {/* Achievement Badges grid with custom states (Image 3.6 representation) */}
      <div className="bg-[#141220] border border-violet-500/10 p-4 rounded-2xl">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-mono text-violet-300/60 font-semibold uppercase tracking-wider">
            Kazanılan Rozetler ({badges.filter((b) => b.unlocked).length}/{badges.length})
          </span>
          <span className="text-[9px] text-violet-300/40">Detaylar</span>
        </div>

        {/* Badges Grid (Pictured in Image 3.6) */}
        <div className="grid grid-cols-4 gap-2.5">
          {badges.map((badge) => {
            const cls = getBadgeColors(badge);
            return (
              <div
                key={badge.id}
                className={`flex flex-col items-center text-center p-2 rounded-xl border transition-all ${cls.bg} shadow-md`}
                title={`${badge.title}: ${badge.description}`}
              >
                {/* Round Badge background representation */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 ${cls.text}`}>
                  {renderBadgeIcon(badge.icon, cls.text)}
                </div>

                <span className="text-[8px] font-bold text-violet-100 truncate w-full tracking-tighter leading-snug">
                  {badge.title}
                </span>

                {/* Micro-Progress Bar for locked badge */}
                {!badge.unlocked && (
                  <div className="w-full h-1 bg-white/5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-violet-500"
                      style={{ width: `${(badge.progressCurrent / badge.progressMax) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress level Cards (Image 3.6 bottom cards: Next Level Progress, Concentration, Organization) */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono text-violet-300/60 font-semibold uppercase tracking-wider">
          İlerleme Kartları (Progress Cards)
        </h4>

        {/* Card 1: Next Level Progress */}
        <div className="bg-[#141220] border border-violet-500/10 p-3 rounded-xl">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-white">Sonraki Seviye İlerlemesi</span>
            <span className="font-mono text-[10px] text-fuchsia-400 font-bold">Lvl {stats.level + 1} İçin %75</span>
          </div>

          {/* Simple percentage line loader */}
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <span className="text-[9px] text-violet-300/40 font-mono mt-1 block">
            Seviye atlamak ve yeni rozetler kazanmak için 240 XP daha kazan!
          </span>
        </div>

        {/* Card 2: Concentration skill */}
        <div className="bg-[#141220] border border-violet-500/10 p-3 rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold text-white block">Odaklanma Seviyesi (Concentration)</span>
            <span className="text-[10px] text-violet-300/40 font-mono mt-0.5 block">18 / 24 Seans Tamamlandı</span>
          </div>

          {/* Mini dial percentage */}
          <span className="font-display font-black text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2 py-1 rounded-lg">
            %75
          </span>
        </div>
      </div>

      {/* Developer helper module for local actions and clean reset */}
      <div className="border border-red-500/10 bg-red-500/5 rounded-xl p-3 text-center space-y-2 mt-2">
        <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider block">Geliştirici Araçları</span>
        <button
          onClick={triggerReset}
          className="text-xs flex items-center gap-1 mx-auto bg-red-600 hover:bg-red-500 text-white font-medium px-4 py-1.5 rounded-lg cursor-pointer transition-colors"
        >
          <RefreshCcw className="w-3.5 h-3.5 animate-spin-one" />
          <span>{resetConfirm ? 'Emin misiniz? (Tıklayın)' : 'Uygulama Verilerini Sıfırla'}</span>
        </button>
        <span className="text-[8px] font-mono text-violet-300/30 block leading-tight">
          Bu işlem, lokal verilerinizi (görevler, seanslar, streak) temizleyerek orijinal test verilerini yükler.
        </span>
      </div>
    </div>
  );
}
