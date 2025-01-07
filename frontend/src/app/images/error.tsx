'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Error = ({ error }: any) => {
  return (
    <div className='flex h-[calc(100vh-64px)] items-center justify-center'>
      <div className='flex h-full w-full max-w-md flex-col gap-4 rounded-lg p-8 text-center'>
        <div className='relative mx-auto aspect-square h-auto w-64'>
          <Image
            src={process.env.NEXT_PUBLIC_DEFAULT_IMAGE!} // Make sure to add your error image in the public folder
            alt='Error Illustration'
            fill
            priority
            className='h-full w-full'
          />
        </div>

        <h1 className='text-3xl font-bold text-gray-800'>Oops! 잘못된 접근이에요.</h1>

        <Link
          href={'/'}
          className='mx-auto w-fit rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
        >
          ← 돌아가기
        </Link>
        <p className='text-red-500'>에러 메시지: {error.message}</p>
      </div>
    </div>
  );
};

export default Error;
