import React from 'react';
import Button from '@/app/components/Button';
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export default function Main() {
  return (
    <div className='flex my-0 text-center min-h-screen'>
      <div className='m-auto'>
        <span className="block font-serif text-5xl font-medium leading-[66px] text-primary-text">
          Welcome to Leo
        </span>
        <p className="font-serif leading-7 text-[#6c6b69] text-center mt-4 mb-8 max-w-2xl mx-auto">
          Leo will teach in a new way. You’ll learn through thoughtful practice,
          spaced repetition, and interactive sessions. You’ll understand the
          principles of your foreign language on a deep level.
        </p>
        <Button text="Enter" Icon={ArrowRightIcon} to="/map" />
      </div>
    </div>
  );
}
