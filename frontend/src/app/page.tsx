'use client';

import { CameraIcon, FolderOpenIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import FileCaptureInput from '@/components/atoms/FileCaptureInput';
import CarouselComponent from '@/components/blocks/Carousel';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export default function Main() {
  return (
    <div className='container mx-auto max-w-[784px] p-4'>
      <div className='text-sm text-muted-foreground'>2024.01.05 Sunday</div>
      <div className='text-lg font-semibold'>Good Morning ☀️</div>
      <div className='mb-4 flex w-fit rounded-md bg-slate-200'>
        <p className='flex h-8 w-8 items-center justify-center rounded-md bg-blue-200 font-semibold'>S</p>
        <p className='flex h-8 w-8 items-center justify-center rounded-md bg-blue-200 font-semibold'>M</p>
        <p className='flex h-8 w-8 items-center justify-center rounded-md bg-slate-200 font-semibold'>T</p>
        <p className='flex h-8 w-8 items-center justify-center rounded-md bg-slate-200 font-semibold'>W</p>
        <p className='flex h-8 w-8 items-center justify-center rounded-md bg-slate-200 font-semibold'>T</p>
        <p className='flex h-8 w-8 items-center justify-center rounded-md bg-slate-200 font-semibold'>S</p>
      </div>
      <main className='flex flex-col items-center justify-center'>
        <div
          className={cn(
            'flex w-full flex-col items-center justify-center gap-2 rounded-lg border bg-background p-3',
            'relative h-full w-full overflow-hidden rounded-2xl border-[2px] border-transparent bg-gradient-to-r from-[#ff9a9db6] via-[#fad0c4ae] to-[#d5fc79a1] bg-clip-border bg-origin-border'
          )}
        >
          <p className='z-10 w-full'>일정 추가하기</p>
          {/* <div className='relative my-2 aspect-video h-auto w-full max-w-[300px]'>
          <Image className='absolute' fill src={'https://images.bamtoly.com/images/memo-test.jpeg'} alt='Ramram' />
        </div> */}
          <div className='z-10 flex w-full items-center justify-center gap-2'>
            <FileCaptureInput type='file' capture='environment' accept='image/*' onFileChange={() => {}}>
              <div className='aspect-square rounded-full bg-muted-foreground/10 p-2'>
                <CameraIcon />
              </div>
            </FileCaptureInput>
            <div className='w-full'>
              <FileCaptureInput type='file' capture='environment' accept='image/*' onFileChange={() => {}}>
                <div className='flex w-full items-center justify-center gap-2 rounded-xl border bg-muted-foreground/10 p-2 text-center text-sm'>
                  <FolderOpenIcon />
                  앨범에서 추가하기
                </div>
              </FileCaptureInput>
            </div>
          </div>
          <div className="z-1 absolute left-0 top-0 h-full w-full rounded-lg bg-background content-['']" />
        </div>

        {/* 내 습관 */}
        <div className='w-full'>
          <p className='py-2'>내 습관</p>
          <div className='w-full'>
            <div className='flex w-full flex-col items-center justify-center rounded-lg border bg-background py-2'>
              <ul className='flex w-full flex-col justify-start gap-2 px-3'>
                <li className='w-full py-1'>
                  <p className='flex items-center gap-1 text-lg'>
                    <Checkbox />물 마시기
                  </p>
                  <div className='flex w-full justify-start gap-1 pr-2'>
                    {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                      <div
                        key={value}
                        className='flex aspect-square h-auto w-full items-center justify-center rounded-2xl border bg-red-50'
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                </li>
              </ul>
              <Button className='w-[calc(100%-20px)] rounded-xl'>추가하기</Button>
            </div>
          </div>
        </div>

        {/*  내 기록 */}
        <div className='w-full'>
          <p className='py-2'>내 기록</p>
          <div className='h-[240px] w-full'>
            <CarouselComponent
              tabs={[
                {
                  content: (
                    <div className='flex h-[240px] w-full items-center justify-center rounded-lg border bg-background'>
                      <div className='relative my-2 aspect-video h-auto w-full max-w-[300px]'>
                        <Image
                          className='absolute'
                          fill
                          src={'https://images.bamtoly.com/images/memo-test.jpeg'}
                          alt='Ramram'
                        />
                      </div>
                    </div>
                  ),
                  id: 'Example',
                  title: 'Example',
                },
                {
                  content: (
                    <div className='flex h-[240px] w-full items-center justify-center rounded-lg border bg-background'>
                      <div className='relative my-2 aspect-video h-auto w-full max-w-[300px]'>
                        <Image
                          className='absolute'
                          fill
                          src={'https://images.bamtoly.com/images/memo-test.jpeg'}
                          alt='Ramram'
                        />
                      </div>
                    </div>
                  ),
                  id: 'Example2',
                  title: 'Example2',
                },
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
