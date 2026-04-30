import { Calendar, Clock, ExternalLink, MapPin } from 'lucide-react';
import { Button } from '../ui/button';

export default function EventCard({
  title,
  date,
  time,
  location,
  address,
  mapsUrl,
}: {
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  mapsUrl: string;
}) {
  return (
    <div className="bg-card border-border rounded-2xl border p-6 md:p-8">
      <h3 className="text-foreground mb-6 text-center font-serif text-2xl font-bold">
        {title}
      </h3>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Calendar className="text-primary mt-0.5 h-5 w-5" />
          <div>
            <p className="text-foreground font-medium">{date}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="text-primary mt-0.5 h-5 w-5" />
          <div>
            <p className="text-foreground font-medium">{time}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="text-primary mt-0.5 h-5 w-5" />
          <div>
            <p className="text-foreground font-medium">{location}</p>
            <p className="text-muted-foreground text-sm">{address}</p>
          </div>
        </div>
      </div>
      <Button
        variant="outline"
        className="border-primary text-primary-dark hover:bg-primary/10 mt-6 w-full"
        asChild
      >
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
          <MapPin className="mr-2 h-4 w-4" />
          Buka Maps
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
  );
}
