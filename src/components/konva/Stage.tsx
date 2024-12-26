'use client';

import useCanvasMouseStyle from '@/hooks/useCanvasMouseStyle';
import useCanvasTransform from '@/hooks/useCanvasTransform';
import useCanvasStore from '@/stores/useCanvasStore';
import Konva from 'konva';
import { Stage as KonvaStage } from 'react-konva';

interface Props {
  children: React.ReactNode;
  onMouseDown: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onMouseMove: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onMouseUp: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onClick?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

export default function Stage({
  children,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onClick,
}: Props) {
  const mouseCursor = useCanvasMouseStyle();

  const { viewPos, scale } = useCanvasStore();
  const {
    handleWheel,
    handleDragStart,
    handleDragEnd,
    handleDragMove,
    draggable,
  } = useCanvasTransform();

  return (
    <KonvaStage
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ cursor: mouseCursor }}
      draggable={draggable}
      onWheel={handleWheel}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onClick={onClick}
      scaleX={scale}
      scaleY={scale}
      x={viewPos.x}
      y={viewPos.y}
    >
      {children}
    </KonvaStage>
  );
}
