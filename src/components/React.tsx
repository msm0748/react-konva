'use client';

import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';
import { useState } from 'react';

export default function ColoredRect() {
  const [color, setColor] = useState('green');

  const handleClick = () => {
    setColor(Konva.Util.getRandomColor());
  };

  return (
    <Rect
      x={20}
      y={20}
      width={50}
      height={50}
      fill={color}
      shadowBlur={5}
      onClick={handleClick}
    />
  );
}
