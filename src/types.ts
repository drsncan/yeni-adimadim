export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  createdAt: string;
}

export interface FocusSession {
  id: string;
  taskTitle: string;
  durationSeconds: number; // actual spent time
  targetSeconds: number; // requested time
  notes: string;
  date: string; // YYYY-MM-DD
  type: 'work' | 'break';
  completedAt: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  unlocked: boolean;
  unlockedAt?: string;
  progressMax: number;
  progressCurrent: number;
  category: 'streak' | 'time' | 'tasks';
}

export interface UserStats {
  streak: number;
  bestStreak: number;
  totalFocusTime: number; // in hours
  xp: number;
  level: number;
}
