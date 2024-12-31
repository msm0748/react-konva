'use client';

import useCanvasStore from '@/stores/useCanvasStore';
import { Action, Position } from '@/types/Canvas';
import { calculateRelativeMousePosition } from '@/utils/calculateMousePosition';
import { getDistanceFromPointToLine } from '@/utils/shapes/polygon';
import { KonvaEventObject } from 'konva/lib/Node';
import { useState } from 'react';
import { Circle, Line } from 'react-konva';

interface Props {
  points: Position[];
  isComplete: boolean;
  setIsComplete: React.Dispatch<React.SetStateAction<boolean>>;
  setPoints: React.Dispatch<React.SetStateAction<Position[]>>;
  action: Action;
  setAction: React.Dispatch<React.SetStateAction<Action>>;
}

export default function Polygon({
  points,
  isComplete,
  setIsComplete,
  setPoints,
  action,
  setAction,
}: Props) {
  const { selectedTool, scale } = useCanvasStore();
  const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);
  const [isDraggingShape, setIsDraggingShape] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState<Position | null>(
    null
  );

  console.log(points, 'points');

  const handleLineMouseDown = (e: KonvaEventObject<MouseEvent>): void => {
    if (selectedTool !== 'select') return;

    e.cancelBubble = true;

    if (isDraggingShape) return;

    if (!isComplete) return;

    const stage = e.target.getStage();
    if (!stage) return;

    const clickPoint = stage.getPointerPosition();
    if (!clickPoint) return;

    const [x, y] = calculateRelativeMousePosition(clickPoint);
    const pos = { x, y };

    let minDistance = Infinity;
    let insertIndex = -1;
    let insertPoint: Position | null = null;

    for (let i = 0; i < points.length; i++) {
      const start = points[i];
      const end = points[(i + 1) % points.length];

      const result = getDistanceFromPointToLine(pos, start, end);

      if (
        result.distance < minDistance &&
        result.param >= 0 &&
        result.param <= 1
      ) {
        minDistance = result.distance;
        insertIndex = i + 1;
        insertPoint = result.position;
      }
    }

    if (minDistance < 10 && insertPoint) {
      const newPoints = [...points];
      newPoints.splice(insertIndex, 0, insertPoint);
      setPoints(newPoints);
      setDragStartIndex(insertIndex);
      setAction('updating');
    } else if (isComplete) {
      const stage = e.target.getStage();
      if (stage) {
        const pos = stage.getPointerPosition();
        if (pos) {
          setIsDraggingShape(true);
          setAction('updating');
          setLastMousePosition({ x: pos.x, y: pos.y });
        }
      }
    }
  };

  const handleCircleMouseDown = (index: number): void => {
    if (index === 0 && points.length >= 2) {
      setIsComplete(true);
    }
  };

  const handleDragStart = (): void => {
    if (selectedTool !== 'select') return;
    setAction('updating');
  };

  const handleDragMove = (
    e: KonvaEventObject<DragEvent>,
    index: number
  ): void => {
    const point = e.target;
    const newPoints = [...points];
    newPoints[index] = {
      x: point.x(),
      y: point.y(),
    };
    setPoints(newPoints);
  };

  const handleDragEnd = (
    e: KonvaEventObject<DragEvent>,
    index: number
  ): void => {
    const point = e.target;
    const newPoints = [...points];
    newPoints[index] = {
      x: point.x(),
      y: point.y(),
    };
    setPoints(newPoints);
    setAction('none');
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>): void => {
    if (!isDraggingShape || !lastMousePosition) return;

    const stage = e.target.getStage();
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    // scale로 나누어 확대/축소에 따른 이동 거리를 보정
    const dx = (pos.x - lastMousePosition.x) / scale;
    const dy = (pos.y - lastMousePosition.y) / scale;

    // 모든 점들을 보정된 거리만큼 이동
    const newPoints = points.map((point) => ({
      x: point.x + dx,
      y: point.y + dy,
    }));

    setPoints(newPoints);
    setLastMousePosition({ x: pos.x, y: pos.y });
  };

  const handleMouseUp = (): void => {
    if (isDraggingShape) {
      setIsDraggingShape(false);
      setLastMousePosition(null);
      setAction('none');
    }
  };

  return (
    <>
      <Line
        points={points.flatMap((point) => [point.x, point.y])}
        stroke="#000000"
        strokeWidth={2}
        closed={isComplete}
        fill={isComplete ? 'rgba(0, 0, 0, 0.1)' : undefined}
        onMouseDown={handleLineMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        hitStrokeWidth={10}
        listening={true}
      />
      {points.map((point, index) => (
        <Circle
          key={index}
          x={point.x}
          y={point.y}
          radius={6}
          fill={index === 0 ? '#ff0000' : '#000000'}
          draggable={selectedTool === 'select' && !isDraggingShape}
          onDragStart={handleDragStart}
          onDragMove={(e) => handleDragMove(e, index)}
          onDragEnd={(e) => handleDragEnd(e, index)}
          onMouseDown={() => handleCircleMouseDown(index)}
          ref={
            index === dragStartIndex
              ? (node) => {
                  if (node) {
                    node.startDrag();
                    setDragStartIndex(null);
                  }
                }
              : undefined
          }
        />
      ))}
    </>
  );
}
