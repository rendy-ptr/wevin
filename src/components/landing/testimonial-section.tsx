import { TESTIMONIALS } from '@/constants/testimonial-section';
import { StarIcon } from '../ui/star';

export function TestimonialsSection() {
  return (
    <section className="bg-card px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="font-script text-primary mb-2 text-2xl">Testimoni</p>
          <h2 className="text-foreground mb-4 font-serif text-3xl font-bold md:text-4xl">
            Kata Mereka
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Ribuan pasangan telah mempercayakan undangan pernikahan mereka
            kepada kami.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={index}
              className="bg-background border-border rounded-2xl border p-8 shadow-sm"
            >
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className="text-accent fill-accent h-5 w-5"
                  />
                ))}
              </div>

              <p className="text-foreground mb-6 leading-relaxed italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="bg-primary/20 flex h-12 w-12 items-center justify-center rounded-full">
                  <span className="text-primary-dark font-serif font-semibold">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <p className="text-foreground font-semibold">
                    {testimonial.name}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
