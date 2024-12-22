'use client';

import { Layer, Stage, Text } from 'react-konva';
import ColoredRect from './React';

export default function Canvas() {
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Text text="Try click on rect" />
        <ColoredRect />
      </Layer>
    </Stage>
  );
}
