'use client';

import useCanvasImageLayerStore from '@/stores/useFilterStore';
import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { Image, Layer } from 'react-konva';
import useImage from 'use-image';

export default function ImageLayer() {
  const [image] = useImage('https://konvajs.org/assets/lion.png', 'anonymous');

  const imageRef = useRef<Konva.Image>(null);

  const { brightness, contrast } = useCanvasImageLayerStore();

  useEffect(() => {
    if (imageRef.current && image) {
      const img = imageRef.current;
      img.cache(); // 필터 적용을 위해 캐싱 필요
      img.filters([Konva.Filters.Brighten, Konva.Filters.Contrast]);
      img.brightness(brightness);
      img.contrast(contrast);
      // console.log(img.getLayer());
      img.getLayer()?.batchDraw();
    }
  }, [image, brightness, contrast]);
  return (
    <Layer>
      <Image
        image={image}
        alt="lion"
        x={40}
        y={80}
        width={300}
        height={300}
        ref={imageRef}
      />
    </Layer>
  );
}
