'use client';

import React, { Suspense, useState } from 'react';

import { useDotButton } from '@/hooks/useDotButton';
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '../ui/carousel';

type Props = {
  tabs: {
    content: React.ReactNode;
    id: string;
    title?: string;
  }[];
};

const CarouselComponent = ({ tabs }: Props) => {
  const [api, setApi] = useState<CarouselApi>();
  const { onDotButtonClick, selectedIndex } = useDotButton(api);

  return (
    <Carousel setApi={setApi} className='h-full w-full' opts={{ loop: true }}>
      <CarouselContent className='w-full'>
        {tabs.map(({ content, title }) => (
          <CarouselItem className='relative w-full' key={title}>
            {content}
          </CarouselItem>
        ))}
      </CarouselContent>
      <div id='tabs' className='mt-1 flex w-full items-center justify-center gap-2'>
        {tabs.map(({ title }, index) => (
          <Button
            className={cn(
              'h-1 w-1 rounded-xl bg-muted-foreground/40 p-1 text-sm hover:bg-transparent',
              selectedIndex === index && 'bg-primary text-primary underline-offset-4'
            )}
            key={title}
            variant='ghost'
            onClick={() => onDotButtonClick(index)}
          ></Button>
        ))}
      </div>
    </Carousel>
  );
};

export default CarouselComponent;
