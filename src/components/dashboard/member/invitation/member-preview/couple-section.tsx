import { PreviewData } from '@/app/invitation/preview/page';
import { Heart } from 'lucide-react';

export default function MemberPreviewCoupleSection({
  data,
}: {
  data: PreviewData;
}) {
  return (
    <section className="bg-card px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <p className="font-script text-primary mb-8 text-center text-2xl">
          {data.openingGreeting}
        </p>
        <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-center leading-relaxed">
          {data.openingMessage}
        </p>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="text-center">
            <div className="bg-primary-subtle mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full">
              <Heart className="text-primary h-12 w-12" />
            </div>
            <h2 className="font-display text-card-foreground mb-2 text-3xl font-semibold italic">
              {data.groomFullName}
            </h2>
            <p className="text-muted-foreground opacity-80">
              Putra dari
              <br />
              {data.groomParents}
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary-subtle mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full">
              <Heart className="text-primary fill-primary h-12 w-12" />
            </div>
            <h2 className="font-display text-card-foreground mb-2 text-3xl font-semibold italic">
              {data.brideFullName}
            </h2>
            <p className="text-muted-foreground opacity-80">
              Putri dari
              <br />
              {data.brideParents}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
