// components/blocks/RecordCarousel.tsx
import Image from 'next/image';
import CarouselComponent from '@/components/blocks/Carousel';

const RECORDS = [
  {
    id: 'Example',
    title: 'Example',
    src: 'https://images.bamtoly.com/images/memo-test.jpeg',
  },
  {
    id: 'Example2',
    title: 'Example2',
    src: 'https://images.bamtoly.com/images/memo-test.jpeg',
  },
];

export default function RecordCarousel() {
  return (
    <div className="h-[240px] w-full">
      <CarouselComponent
        tabs={RECORDS.map((record) => ({
          id: record.id,
          title: record.title,
          content: (
            <div className="flex h-[240px] w-full items-center justify-center rounded-lg border bg-background">
              <div className="relative my-2 aspect-video h-auto w-full max-w-[300px]">
                <Image className="absolute" fill src={record.src} alt={record.title} />
              </div>
            </div>
          ),
        }))}
      />
    </div>
  );
}
