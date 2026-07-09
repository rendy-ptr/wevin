'use client';
import { useEffect, useState } from 'react';

export default function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const diff = target - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex justify-center gap-4 md:gap-6">
      {[
        { value: timeLeft.days, label: 'Hari' },
        { value: timeLeft.hours, label: 'Jam' },
        { value: timeLeft.minutes, label: 'Menit' },
        { value: timeLeft.seconds, label: 'Detik' },
      ].map((item, index) => (
        <div key={index} className="text-center">
          <div className="bg-card border-border mb-2 flex h-16 w-16 items-center justify-center rounded-xl border md:h-20 md:w-20">
            <span className="text-foreground font-serif text-2xl font-bold md:text-3xl">
              {item.value.toString().padStart(2, '0')}
            </span>
          </div>
          <p className="text-muted-foreground text-xs">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
