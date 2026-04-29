import { Metadata } from 'next';

export function constructMetadata({
  title = 'Wevin - Your Brand Catchphrase',
  description = 'A professional description of Wevin.',
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
