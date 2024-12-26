'use client';

import ImageControlPanel from '@/components/options/ImageControlPanel';
import Tools from '@/components/Tools';
import dynamic from 'next/dynamic';

const Canvas = dynamic(() => import('@/components/Canvas'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="relative h-screen w-screen">
      <Tools />
      <Canvas></Canvas>
      <ImageControlPanel />
    </div>
  );
}
