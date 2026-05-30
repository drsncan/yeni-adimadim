import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface SplashProps {
  onFinish: () => void;
}

export default function Splash({ onFinish }: SplashProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 600);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'linear-gradient(135deg, #1d1b3a 0%, #110e20 40%, #0d0a14 100%)',
      }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-between py-16 px-8 select-none"
    >
      {/* Top spacing */}
      <div className="w-full flex justify-between items-center opacity-60">
        <span className="text-xs font-medium tracking-tight font-mono text-white/50">BUILD v1.0.4 - ACTIVE</span>
        <span className="text-xs font-mono text-violet-400">ANDROID-RN-SPEC</span>
      </div>

      {/* Centered Brand Content */}
      <div className="flex flex-col items-center text-center">
        {/* Adım Adım rising steps logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="relative w-24 h-24 mb-6 flex items-end justify-center"
        >
          {/* Subtle outer glowing orb */}
          <div className="absolute inset-x-0 bottom-0 top-6 bg-violet-500/10 rounded-full blur-2xl"></div>

          {/* Steps */}
          <div className="flex items-end gap-1.5 z-10">
            <motion.div
              initial={{ height: 12 }}
              animate={{ height: 28 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-4 bg-violet-400/40 rounded-t-sm"
            />
            <motion.div
              initial={{ height: 12 }}
              animate={{ height: 44 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="w-4 bg-violet-400/70 rounded-t-sm"
            />
            <motion.div
              initial={{ height: 12 }}
              animate={{ height: 60 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="w-4 bg-gradient-to-t from-violet-500 to-fuchsia-400 rounded-t-sm relative shadow-lg shadow-violet-500/30"
            >
              {/* Star on top of final step */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.3 }}
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-amber-300 drop-shadow-md text-sm font-bold"
              >
                ★
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-4xl font-display font-bold text-white tracking-tight leading-none mb-2"
        >
          Adım Adım
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="text-sm text-violet-200/70 font-sans tracking-wide"
        >
          Productivity, Step by Step.
        </motion.p>
      </div>

      {/* Bottom Loading Indicator */}
      <div className="w-full max-w-xs flex flex-col items-center">
        {/* Loading Spinner / Circle */}
        <div className="relative w-8 h-8 mb-4">
          <svg className="animate-spin w-full h-full text-violet-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>

        {/* Text */}
        <p className="text-xs text-violet-300 font-mono tracking-widest uppercase animate-pulse">
          Açılıyor... {progress}%
        </p>

        {/* Progress Bar background is beautiful and compact */}
        <div className="w-40 h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
          ></motion.div>
        </div>

        {/* Skip text for quick testing */}
        <button
          onClick={onFinish}
          className="mt-6 text-xs text-white/30 hover:text-white/70 transition-colors uppercase font-mono tracking-widest cursor-pointer"
        >
          {`[ Atla ]`}
        </button>
      </div>
    </motion.div>
  );
}
