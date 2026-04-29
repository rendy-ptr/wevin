import { Metadata } from 'next';

export function constructMetadata({
  title = 'Wevin - Weeding Invitation',
  description = 'The perfect platform to celebrate your wedding with friends and family. Wevin makes it easy to share your special moments, RSVP, and get directions to your big day.',
  image = '/thumbnail.svg',
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@yourhandle',
    },
    icons: {
      icon: [
        {
          url: '/icon.svg',
          type: 'image/svg+xml',
        },
      ],
      apple: [
        {
          url: '/icon.svg',
          type: 'image/svg+xml',
        },
      ],
    },
    metadataBase: new URL('https://wevin.com'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
