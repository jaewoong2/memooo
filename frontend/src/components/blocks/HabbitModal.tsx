'use client';

import HabbitForm from '@/components/blocks/HabbitForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function HabbitModal() {
  const { back } = useRouter();
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
    <Dialog open={open} onOpenChange={handleChangeOpen} >
      <DialogContent className='flex md:h-[80%] w-full flex-col max-md:top-[10%] max-md:translate-y-0 max-md:rounded-t-3xl max-md:h-[90%]'>
        <DialogHeader>
          <DialogTitle>새로운 습관 만들기</DialogTitle>
        </DialogHeader>
        <div className='relative h-full w-full'>
          <HabbitForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
