import { PreviewData } from '@/app/invitation/preview/page';
import Image from 'next/image';

export default function MemberPreviewGallerySection({
  data,
}: {
  data: PreviewData;
}) {
  return (
    <section className="bg-card px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <p className="font-script text-primary mb-2 text-center text-2xl">
          Galeri
        </p>
        <h2 className="text-card-foreground mb-12 text-center font-serif text-3xl font-bold">
          Foto Pre-wedding
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {data.photos?.length > 0 ? (
            data.photos.map((photo: string, index: number) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-2xl"
              >
                <Image
                  src={photo || '/placeholder-1.jpg'}
                  alt={`Gallery ${index + 1}`}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
              </div>
            ))
          ) : (
            <p className="text-muted-foreground col-span-full py-10 text-center text-sm">
              Belum ada foto yang diunggah.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
