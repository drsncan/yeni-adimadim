import { useState, useEffect } from 'react';
import { Task, FocusSession, AchievementBadge, UserStats } from './types';

const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Finalize feature specs', completed: true, category: 'Project Horizon', createdAt: '2026-05-28' },
  { id: 't2', title: 'Draft marketing email', completed: false, category: 'Marketing', createdAt: '2026-05-29' },
  { id: 't3', title: 'Design "Step by Step" progress icon', completed: false, category: 'UI/UX Design', createdAt: '2026-05-30' },
  { id: 't4', title: 'Review documentation feedback', completed: true, category: 'Research', createdAt: '2026-05-27' },
];

const INITIAL_SESSIONS: FocusSession[] = [
  { id: 's1', taskTitle: 'Finalize feature specs', durationSeconds: 2700, targetSeconds: 2700, notes: 'Completed the major functional specifications.', date: '2026-05-30', type: 'work', completedAt: '14:30' },
  { id: 's2', taskTitle: 'Review documentation feedback', durationSeconds: 1800, targetSeconds: 1800, notes: 'Read through Enver’s comments.', date: '2026-05-29', type: 'work', completedAt: '11:15' },
  { id: 's3', taskTitle: 'Design progress icon', durationSeconds: 3600, targetSeconds: 3600, notes: 'Explored multi-color gradients.', date: '2026-05-28', type: 'work', completedAt: '16:00' },
  { id: 's4', taskTitle: 'Brainstorm session', durationSeconds: 2400, targetSeconds: 2400, notes: 'Set up basic React Native scaffolding.', date: '2026-05-27', type: 'work', completedAt: '10:45' },
  { id: 's5', taskTitle: 'Quick fix', durationSeconds: 1500, targetSeconds: 1500, notes: 'Fixed button alignment in tabs.', date: '2026-05-26', type: 'work', completedAt: '18:10' },
  { id: 's6', taskTitle: 'Database setup', durationSeconds: 3600, targetSeconds: 3600, notes: 'AsyncStorage keys defined.', date: '2026-05-25', type: 'work', completedAt: '15:20' },
  { id: 's7', taskTitle: 'Navigation debug', durationSeconds: 3000, targetSeconds: 3000, notes: 'Bottom navigation tab animations are smooth.', date: '2026-05-24', type: 'work', completedAt: '09:00' },
];

const INITIAL_BADGES: AchievementBadge[] = [
  { id: 'b1', title: 'Streak Master', description: 'Maintain a 7-day focus streak', icon: 'Flame', unlocked: true, unlockedAt: '2026-05-24', progressMax: 7, progressCurrent: 7, category: 'streak' },
  { id: 'b2', title: 'Focus Hero', description: 'Complete 10 focus sessions', icon: 'Shield', unlocked: true, unlockedAt: '2026-05-26', progressMax: 10, progressCurrent: 10, category: 'tasks' },
  { id: 'b3', title: 'Goal Setter', description: 'Define and complete 5 main tasks', icon: 'Target', unlocked: true, unlockedAt: '2026-05-27', progressMax: 5, progressCurrent: 5, category: 'tasks' },
  { id: 'b4', title: 'Time Wizard', description: 'Amass 150 hours of total focus', icon: 'Clock', unlocked: true, unlockedAt: '2026-05-28', progressMax: 150, progressCurrent: 150, category: 'time' },
  { id: 'b5', title: 'Early Bird', description: 'Focus before 8:00 AM', icon: 'Compass', unlocked: true, unlockedAt: '2026-05-25', progressMax: 1, progressCurrent: 1, category: 'streak' },
  { id: 'b6', title: 'Focus Expert', description: 'Focus for 200 hours total', icon: 'Award', unlocked: false, progressMax: 200, progressCurrent: 185, category: 'time' },
  { id: 'b7', title: 'Consistency King', description: 'Maintain a 30-day streak', icon: 'Gem', unlocked: false, progressMax: 30, progressCurrent: 14, category: 'streak' },
];

const INITIAL_STATS: UserStats = {
  streak: 14,
  bestStreak: 18,
  totalFocusTime: 185, // in hours
  xp: 7520, // corresponding to 752 completed tasks approx
  level: 18,
};

export function useAppStore() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const local = localStorage.getItem('adim_tasks');
    return local ? JSON.parse(local) : INITIAL_TASKS;
  });

  const [sessions, setSessions] = useState<FocusSession[]>(() => {
    const local = localStorage.getItem('adim_sessions');
    return local ? JSON.parse(local) : INITIAL_SESSIONS;
  });

  const [badges, setBadges] = useState<AchievementBadge[]>(() => {
    const local = localStorage.getItem('adim_badges');
    return local ? JSON.parse(local) : INITIAL_BADGES;
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const local = localStorage.getItem('adim_stats');
    return local ? JSON.parse(local) : INITIAL_STATS;
  });

  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('adim_user_name') || 'John Doe';
  });

  const [userTitle, setUserTitle] = useState<string>(() => {
    return localStorage.getItem('adim_user_title') || 'Focus Adept';
  });

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('adim_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('adim_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('adim_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('adim_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('adim_user_name', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('adim_user_title', userTitle);
  }, [userTitle]);

  // Tasks actions
  const addTask = (title: string, category: string = 'General') => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      completed: false,
      category,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updatedCompleted = !t.completed;
          // Increment or decrement stats accordingly
          if (updatedCompleted) {
            setStats((curr) => ({
              ...curr,
              xp: curr.xp + 50,
            }));
          } else {
            setStats((curr) => ({
              ...curr,
              xp: Math.max(0, curr.xp - 50),
            }));
          }
          return { ...t, completed: updatedCompleted };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Add session notes or complete a session
  const addFocusSession = (taskTitle: string, durationSeconds: number, targetSeconds: number, notes: string, type: 'work' | 'break' = 'work') => {
    const formattedDate = new Date().toISOString().split('T')[0];
    const formattedTime = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    const newSession: FocusSession = {
      id: Math.random().toString(36).substr(2, 9),
      taskTitle: taskTitle || (type === 'work' ? 'General Focus' : 'Short Break'),
      durationSeconds,
      targetSeconds,
      notes,
      date: formattedDate,
      type,
      completedAt: formattedTime,
    };

    setSessions((prev) => [newSession, ...prev]);

    // Update statistics
    if (type === 'work') {
      const addedHours = Number((durationSeconds / 3600).toFixed(2));
      setStats((curr) => {
        const newTotalHours = curr.totalFocusTime + addedHours;
        const newXP = curr.xp + Math.floor(addedHours * 100) + 150; // extra reward for session completion
        const nextLevelThreshold = curr.level * 1000;
        let newLevel = curr.level;
        let finalXP = newXP;

        if (finalXP >= nextLevelThreshold) {
          newLevel += 1;
        }

        return {
          ...curr,
          totalFocusTime: Number(newTotalHours.toFixed(1)),
          xp: finalXP,
          level: newLevel,
          streak: curr.streak + (curr.streak < 30 ? 1 : 0), // hypothetical daily addition helper
        };
      });

      // Update badge progress dynamically!
      setBadges((prevBadges) =>
        prevBadges.map((badge) => {
          if (badge.category === 'time') {
            const addedNum = Number((durationSeconds / 3600).toFixed(2));
            const newProgress = Math.min(badge.progressMax, Number((badge.progressCurrent + addedNum).toFixed(1)));
            const unlocked = newProgress >= badge.progressMax;
            return {
              ...badge,
              progressCurrent: newProgress,
              unlocked: badge.unlocked || unlocked,
              unlockedAt: badge.unlocked ? badge.unlockedAt : (unlocked ? formattedDate : undefined),
            };
          }
          if (badge.category === 'tasks') {
            const newProgress = Math.min(badge.progressMax, badge.progressCurrent + 1);
            const unlocked = newProgress >= badge.progressMax;
            return {
              ...badge,
              progressCurrent: newProgress,
              unlocked: badge.unlocked || unlocked,
              unlockedAt: badge.unlocked ? badge.unlockedAt : (unlocked ? formattedDate : undefined),
            };
          }
          return badge;
        })
      );
    }
  };

  const editProfile = (name: string, title: string) => {
    setUserName(name);
    setUserTitle(title);
  };

  // Reset helper
  const resetAllData = () => {
    setTasks(INITIAL_TASKS);
    setSessions(INITIAL_SESSIONS);
    setBadges(INITIAL_BADGES);
    setStats(INITIAL_STATS);
    setUserName('John Doe');
    setUserTitle('Focus Adept');
  };

  return {
    tasks,
    sessions,
    badges,
    stats,
    userName,
    userTitle,
    addTask,
    toggleTask,
    deleteTask,
    addFocusSession,
    editProfile,
    resetAllData,
    setStats,
    setBadges,
  };
}
