import { PreviewData } from '@/app/invitation/preview/page';
import { formatDate } from '@/lib/date';
import { useEffect, useState } from 'react';

export default function MemberPreviewHeroSection({
  data,
}: {
  data: PreviewData;
}) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!data?.eventDate) return;
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = data.eventDate.getTime();
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
  }, [data?.eventDate]);

  return (
    <section className="bg-background relative flex min-h-[80vh] flex-col items-center justify-center px-6 py-16">
      <div className="bg-primary-subtle absolute top-10 left-10 h-24 w-24 rounded-full opacity-40 blur-2xl" />
      <div className="bg-primary-subtle absolute right-10 bottom-10 h-32 w-32 rounded-full opacity-40 blur-2xl" />

      <p className="font-script text-primary mb-4 text-xl md:text-2xl">
        {data.prefixTitle}
      </p>

      <h1 className="font-display text-foreground mb-8 text-center text-4xl font-semibold italic md:text-6xl">
        {data.groomName} & {data.brideName}
      </h1>

      <div className="bg-accent mb-8 h-px w-24" />

      <p className="text-muted-foreground mb-8 text-center">
        {formatDate(data.eventDate)}
      </p>

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
    </section>
  );
}
