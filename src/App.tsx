import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Home as HomeIcon, BarChart3, Timer, User as UserIcon } from 'lucide-react';
import { useAppStore } from './store';
import MobileFrame from './components/MobileFrame';
import Splash from './components/Splash';
import HomeTab from './components/HomeTab';
import StatsTab from './components/StatsTab';
import FocusTab from './components/FocusTab';
import ProfileTab from './components/ProfileTab';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'stats' | 'focus' | 'profile'>('home');
  const [preselectedTask, setPreselectedTask] = useState('');

  // Pull global business logic actions & state
  const {
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
  } = useAppStore();

  const handleNavigateToFocus = (taskTitle?: string) => {
    if (taskTitle) {
      setPreselectedTask(taskTitle);
    } else {
      setPreselectedTask('');
    }
    setActiveTab('focus');
  };

  const currentTabRender = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeTab
            stats={stats}
            tasks={tasks}
            sessions={sessions}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            addTask={addTask}
            onNavigateToFocus={handleNavigateToFocus}
          />
        );
      case 'stats':
        return <StatsTab stats={stats} sessions={sessions} />;
      case 'focus':
        return (
          <FocusTab
            tasks={tasks}
            preselectedTaskTitle={preselectedTask}
            addFocusSession={addFocusSession}
          />
        );
      case 'profile':
        return (
          <ProfileTab
            userName={userName}
            userTitle={userTitle}
            stats={stats}
            badges={badges}
            editProfile={editProfile}
            resetAllData={resetAllData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full min-h-screen">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <div key="splash">
            <Splash onFinish={() => setShowSplash(false)} />
          </div>
        ) : (
          <motion.div
            key="app-main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full min-h-screen"
          >
            <MobileFrame
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab as any)}
              onReset={resetAllData}
            >
              <div className="flex-1 flex flex-col justify-between overflow-hidden relative">
                {/* Router-like tab switch viewport with smooth side slide animations */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    {currentTabRender()}
                  </motion.div>
                </AnimatePresence>

                {/* Bottom Navigation Tabs Panel (Image 3.6 representation: Home, Stats, Focus, Profile) */}
                <div className="absolute bottom-0 inset-x-0 bg-[#130f24]/95 backdrop-blur-md border-t border-violet-500/10 px-4 py-2.5 flex justify-between items-center z-30 select-none">
                  {/* Home Tab */}
                  <button
                    onClick={() => {
                      setPreselectedTask('');
                      setActiveTab('home');
                    }}
                    className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all cursor-pointer ${
                      activeTab === 'home' ? 'text-violet-400 font-bold scale-105' : 'text-violet-300/40 hover:text-white'
                    }`}
                  >
                    <HomeIcon className="w-5 h-5" />
                    <span className="text-[9px] font-medium tracking-wide">Ana Ekran</span>
                  </button>

                  {/* Stats Tab */}
                  <button
                    onClick={() => setActiveTab('stats')}
                    className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all cursor-pointer ${
                      activeTab === 'stats' ? 'text-violet-400 font-bold scale-105' : 'text-violet-300/40 hover:text-white'
                    }`}
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span className="text-[9px] font-medium tracking-wide">İstatistik</span>
                  </button>

                  {/* Focus Tab (pulsing center item if active) */}
                  <button
                    onClick={() => setActiveTab('focus')}
                    className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all cursor-pointer ${
                      activeTab === 'focus' ? 'text-violet-400 font-bold scale-105' : 'text-violet-300/40 hover:text-white'
                    }`}
                  >
                    <Timer className="w-5 h-5" />
                    <span className="text-[9px] font-medium tracking-wide">Odaklan</span>
                  </button>

                  {/* Profile Tab */}
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all cursor-pointer ${
                      activeTab === 'profile' ? 'text-violet-400 font-bold scale-105' : 'text-violet-300/40 hover:text-white'
                    }`}
                  >
                    <UserIcon className="w-5 h-5" />
                    <span className="text-[9px] font-medium tracking-wide">Profil</span>
                  </button>
                </div>
              </div>
            </MobileFrame>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
