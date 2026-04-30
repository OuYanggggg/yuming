'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// =========================================================================
// 配置区域 | Configuration
// =========================================================================
// 设置您的域名到期时间 (Set your domain expiration date here)
// 格式/Format: YYYY-MM-DDT00:00:00+08:00 (根据您的时区进行修改)
const targetDate = new Date("2026-12-31T00:00:00+08:00"); 

// 文案配置方案 (Copywriting Plans)
const TEXT_PLANS = {
  plan1: {
    active: <>有些故事适合留在过去，<br />就像这串字符，终将归于寂静。</>,
    expiredTitle: "后会有期",
    expiredSub: "归于尘埃，不再回望。",
  },
  plan2: {
    active: <>曾以为会永远保留的纪念，<br />也会在倒数结束时，随风飘散。</>,
    expiredTitle: "曲终人散",
    expiredSub: "风过了无痕，再见不负遇见。",
  }
};

// 可以在这里切换方案，例如 TEXT_PLANS.plan1 或 TEXT_PLANS.plan2
// 目前启用的是 plan2
const CURRENT_PLAN = TEXT_PLANS.plan2;
// =========================================================================

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownPage() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    const initialTime = calculateTimeLeft();
    setTimeLeft(initialTime);

    // If it hasn't expired yet, set up the interval
    if (!isExpired) {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isExpired]);

  // Prevent layout shift/flash before hydration
  if (!mounted) return null;

  return (
    <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[40px] p-8 md:p-12 text-center shadow-2xl"
      >
        <header className="mb-12">
          <h1 className="text-white/40 text-xs tracking-[0.4em] uppercase mb-4 font-light">Archive of Memories</h1>
          <div className="h-[1px] w-12 bg-white/20 mx-auto" />
        </header>

        <AnimatePresence mode="wait">
          {!isExpired ? (
            <motion.div
              key="countdown"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 1 }}
              className="space-y-12"
            >
              <p className="text-white/80 text-xl md:text-2xl font-serif italic tracking-wide px-4 md:px-8 leading-relaxed">
                {CURRENT_PLAN.active}
              </p>

              <div className="flex justify-center items-baseline space-x-3 md:space-x-6 text-white overflow-hidden">
                <CountdownUnit value={timeLeft.days} label="Days" />
                <div className="text-2xl md:text-3xl font-thin text-white/20 relative top-[-6px] md:top-[-8px]">:</div>
                <CountdownUnit value={timeLeft.hours} label="Hours" />
                <div className="text-2xl md:text-3xl font-thin text-white/20 relative top-[-6px] md:top-[-8px]">:</div>
                <CountdownUnit value={timeLeft.minutes} label="Mins" />
                <div className="text-2xl md:text-3xl font-thin text-white/20 relative top-[-6px] md:top-[-8px]">:</div>
                <CountdownUnit value={timeLeft.seconds} label="Secs" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="expired"
              initial={{ opacity: 0, filter: "blur(5px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="py-12 space-y-6"
            >
              <h2 className="text-white/90 text-3xl md:text-4xl font-serif tracking-widest">
                {CURRENT_PLAN.expiredTitle}
              </h2>
              <p className="text-white/40 text-sm tracking-[0.2em] font-light">
                {CURRENT_PLAN.expiredSub}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-16 text-white/20 text-[10px] tracking-widest uppercase">
          <p>domain: memory-archive.me</p>
        </footer>
      </motion.div>
    </main>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl md:text-5xl font-light tracking-tighter tabular-nums w-10 md:w-16 text-center block">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[9px] md:text-[10px] text-white/30 uppercase tracking-widest mt-2 block text-center min-w-max">
        {label}
      </span>
    </div>
  );
}
