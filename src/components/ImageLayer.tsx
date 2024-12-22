'use client';

import useCanvasImageLayerStore from '@/stores/useFilterStore';
import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { Image, Layer } from 'react-konva';
import useImage from 'use-image';

export default function ImageLayer() {
  const [image] = useImage('/hq720.jpg', 'anonymous');

  const imageRef = useRef<Konva.Image>(null);

  const { brightness, contrast } = useCanvasImageLayerStore();

  useEffect(() => {
    if (imageRef.current && image) {
      const img = imageRef.current;
      img.cache(); // 필터 적용을 위해 캐싱 필요
      img.filters([Konva.Filters.Brighten, Konva.Filters.Contrast]);
      img.brightness(brightness);
      img.contrast(contrast);
      img.getLayer()?.batchDraw();
    }
  }, [image, brightness, contrast]);
  return (
    <Layer>
      <Image image={image} alt="lion" ref={imageRef} />
    </Layer>
  );
}
