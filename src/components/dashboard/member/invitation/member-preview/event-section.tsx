import { PreviewData } from '@/app/invitation/preview/page';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/date';
import { Calendar, Clock, ExternalLink, MapPin } from 'lucide-react';

export default function MemberPreviewEventSection({
  data,
}: {
  data: PreviewData;
}) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <p className="font-script text-primary mb-2 text-center text-2xl">
          Waktu & Tempat
        </p>
        <h2 className="text-foreground mb-12 text-center font-serif text-3xl font-bold">
          Detail Acara
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="bg-card border-border rounded-2xl border p-6 md:p-8">
            <h3 className="text-card-foreground mb-6 text-center font-serif text-2xl font-bold">
              Akad Nikah
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="text-primary mt-0.5 h-5 w-5" />
                <div>
                  <p className="text-card-foreground font-medium">
                    {formatDate(data.akad.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="text-primary mt-0.5 h-5 w-5" />
                <div>
                  <p className="text-card-foreground font-medium">
                    {data.akad.time}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-primary mt-0.5 h-5 w-5" />
                <div>
                  <p className="text-card-foreground font-medium">
                    {data.akad.location}
                  </p>
                  <p className="text-muted-foreground text-sm opacity-80">
                    {data.akad.address}
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-primary text-primary-dark hover:bg-primary-dark/90 hover:text-primary-foreground mt-6 w-full"
              asChild
            >
              <a
                href={data.akad.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Buka Maps
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
          <div className="bg-card border-border rounded-2xl border p-6 md:p-8">
            <h3 className="text-card-foreground mb-6 text-center font-serif text-2xl font-bold">
              Resepsi
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="text-primary mt-0.5 h-5 w-5" />
                <div>
                  <p className="text-card-foreground font-medium">
                    {formatDate(data.resepsi.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="text-primary mt-0.5 h-5 w-5" />
                <div>
                  <p className="text-card-foreground font-medium">
                    {data.resepsi.time}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-primary mt-0.5 h-5 w-5" />
                <div>
                  <p className="text-card-foreground font-medium">
                    {data.resepsi.location}
                  </p>
                  <p className="text-muted-foreground text-sm opacity-80">
                    {data.resepsi.address}
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-primary text-primary-dark hover:bg-primary-dark/90 hover:text-primary-foreground mt-6 w-full"
              asChild
            >
              <a
                href={data.resepsi.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Buka Maps
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
