'use client';

import { CameraIcon, CheckIcon, FolderOpenIcon, GlassWaterIcon } from 'lucide-react';
import Image from 'next/image';

import FileCaptureInput from '@/components/atoms/FileCaptureInput';
import HabitCard from '@/components/blocks/HabitCard';
import HabitList from '@/components/blocks/HabitList';
import RecordCarousel from '@/components/blocks/RecordCarousel';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const HEADER_TEXT = {
  date: '2024.01.05 Sunday',
  greeting: 'Good Morning ☀️',
  addRecord: '기록 추가하기',
  myHabits: '내 습관',
  myRecords: '내 기록',
  addHabit: '습관 추가하기',
};

export default function Main() {
  return (
    <div className="container mx-auto max-w-[784px]">
      <div className="text-sm text-muted-foreground px-4">{HEADER_TEXT.date}</div>
      <div className="text-lg font-semibold relative px-4">{HEADER_TEXT.greeting}</div>
      <main className="flex flex-col items-center justify-center relative z-10 px-4 py-6">
        {/* 기록 추가하기 */}
        <div
          className={cn(
            'flex w-full flex-col items-center justify-center gap-2 rounded-lg border bg-background p-3',
            'relative h-full w-full overflow-hidden rounded-2xl border-[2px] border-transparent bg-gradient-to-r from-[#ff9a9db6] via-[#fad0c4ae] to-[#d5fc79a1] bg-clip-border bg-origin-border'
          )}
        >
          <p className="z-10 w-full">{HEADER_TEXT.addRecord}</p>
          <div className="z-10 flex w-full items-center justify-center gap-2">
            <FileCaptureInput type="file" capture="environment" accept="image/*" onFileChange={() => {}}>
              <div className="aspect-square rounded-full bg-muted-foreground/10 p-2">
                <CameraIcon />
              </div>
            </FileCaptureInput>
            <div className="w-full">
              <FileCaptureInput type="file" capture="environment" accept="image/*" onFileChange={() => {}}>
                <div className="flex w-full items-center justify-center gap-2 rounded-xl border bg-muted-foreground/10 p-2 text-center text-sm">
                  <FolderOpenIcon /> 앨범에서 추가하기
                </div>
              </FileCaptureInput>
            </div>
          </div>
          <div className="z-1 absolute left-0 top-0 h-full w-full rounded-lg bg-background content-['']" />
        </div>

        {/* 내 습관 */}
        <div className="w-full flex flex-col gap-2">
          <p className="pt-2">{HEADER_TEXT.myHabits}</p>
          <HabitList />
          <Link href={'/habbit'} className={buttonVariants({className: cn("w-full rounded-xl")})}>{HEADER_TEXT.addHabit}</Link>
        </div>

        {/* 내 기록 */}
        {/* <div className="w-full">
          <p className="py-2">{HEADER_TEXT.myRecords}</p>
          <RecordCarousel />
        </div> */}
      </main>
    </div>
  );
}