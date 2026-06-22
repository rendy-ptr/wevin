import { PreviewData } from '@/app/invitation/preview/page';
import { Heart } from 'lucide-react';

export default function MemberPreviewClosingSection({
  data,
}: {
  data: PreviewData;
}) {
  return (
    <section className="px-6 py-16 text-center">
      <div className="mx-auto max-w-lg">
        <Heart className="text-primary fill-primary mx-auto mb-6 h-8 w-8" />
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {data.closingMessage}
        </p>
        <p className="font-script text-primary mb-2 text-2xl">
          {data.closingGreeting}
        </p>
        <p className="text-foreground font-serif text-xl font-semibold">
          {data.groomName.split(' ')[0]} & {data.brideName.split(' ')[0]}
        </p>
      </div>
    </section>
  );
}
