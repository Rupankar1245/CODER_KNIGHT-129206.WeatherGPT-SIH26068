import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  /* ==========================================
     LOADING PROGRESS: 0% → 100%
     ========================================== */

  useEffect(() => {
    const duration = 2500;
    const intervalTime = 25;
    const increment = (100 / duration) * intervalTime;

    const interval = window.setInterval(() => {
      setProgress((previousProgress) => {
        const nextProgress = previousProgress + increment;

        if (nextProgress >= 100) {
          window.clearInterval(interval);
          return 100;
        }

        return nextProgress;
      });
    }, intervalTime);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  /* ==========================================
     COMPLETION → FADE OUT → OPEN APP
     ========================================== */

  useEffect(() => {
    if (progress < 100) return;

    setIsComplete(true);

    const fadeTimer = window.setTimeout(() => {
      setIsFadingOut(true);
    }, 350);

    const completeTimer = window.setTimeout(() => {
      onComplete();
    }, 1100);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(completeTimer);
    };
  }, [progress, onComplete]);

  return (
    <div
      className={`
        fixed inset-0 z-[9999]
        flex min-h-screen w-full items-center justify-center
        overflow-hidden
        bg-[#080b12]
        transition-all duration-700 ease-out
        ${
          isFadingOut
            ? 'pointer-events-none scale-[1.01] opacity-0'
            : 'scale-100 opacity-100'
        }
      `}
    >
      {/* ======================================
          SUBTLE BACKGROUND GLOW
          ====================================== */}

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.06] blur-[140px]" />

      {/* ======================================
          MAIN CONTENT
          ====================================== */}

      <div
        className={`
          relative z-10 flex flex-col items-center
          px-6 text-center
          transition-all duration-500
          ${isComplete ? 'translate-y-0' : 'translate-y-1'}
        `}
      >
        {/* Logo */}

        <div className="mb-7 flex h-24 w-24 items-center justify-center">
          <img
            src="/logo.png"
            alt="MeghAI Logo"
            className="h-full w-full object-contain"
            draggable={false}
          />
        </div>

        {/* Brand Name */}

        <h1 className="text-3xl font-semibold tracking-[0.22em] text-white sm:text-4xl">
          MEGH<span className="text-cyan-400">AI</span>
        </h1>

        {/* Tagline */}

        <p className="mt-3 text-sm font-normal tracking-wide text-slate-500 sm:text-[15px]">
          Weather intelligence, reimagined.
        </p>

        {/* ======================================
            LOADING
            ====================================== */}

        <div className="mt-12 w-56 sm:w-64">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600">
              {isComplete ? 'Ready' : 'Loading'}
            </span>

            <span className="text-[11px] font-medium tabular-nums text-slate-500">
              {Math.round(progress)}%
            </span>
          </div>

          {/* Progress Track */}

          <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/[0.08]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-[width] duration-75 ease-linear"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Bottom Label */}

        <p className="mt-10 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-700">
          AI Powered Weather Intelligence
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
