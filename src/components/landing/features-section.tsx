import { FEATURES } from '@/constants/features-section';

export function FeaturesSection() {
  return (
    <section className="bg-card px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="font-script text-primary mb-2 text-2xl">
            Fitur Unggulan
          </p>
          <h2 className="text-foreground mb-4 font-serif text-3xl font-bold md:text-4xl">
            Semua yang Anda Butuhkan
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Fitur lengkap untuk membuat undangan pernikahan digital yang
            berkesan dan profesional.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="bg-background border-border rounded-2xl border p-8 shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <div className="bg-primary/10 mb-6 flex h-14 w-14 items-center justify-center rounded-xl">
                <feature.icon className="text-primary-dark h-7 w-7" />
              </div>
              <h3 className="text-foreground mb-3 font-serif text-xl font-semibold">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
