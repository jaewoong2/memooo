'use client';

import Image from 'next/image';
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

function getSearchParams<T extends string>(search: ReadonlyURLSearchParams, keys: T[]): Record<T, string | null> {
  return keys.reduce(
    (result, key) => {
      result[key] = search.get(key);
      return result;
    },
    {} as Record<T, string | null>
  );
}

const ImagePage = () => {
  const search = useSearchParams();
  const { back } = useRouter();
  const { image, title } = getSearchParams(search, ['image', 'title']);
  const [open, setOpen] = useState(true);

  if (!image) {
    return;
  }

  const handleChangeOpen = (isOpen: boolean) => {
    if (!isOpen) {
      back();
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleChangeOpen}>
      <DialogContent className='flex h-[80%] w-full flex-col'>
        <DialogHeader>
          <DialogTitle>{title ?? '이미지'}</DialogTitle>
        </DialogHeader>
        <div className='relative h-full w-full'>
          {image && <Image src={image} alt={image} fill className='h-full w-full object-contain' />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePage;
