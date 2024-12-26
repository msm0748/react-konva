'use client';

import { Layer, Line, Circle } from 'react-konva';
import { useState } from 'react';
import Konva from 'konva';
import ImageLayer from './ImageLayer';
import useCanvasStore from '@/stores/useCanvasStore';
import Stage from './konva/Stage';

export default function Canvas() {
  const { viewPos, scale } = useCanvasStore();

  const [points, setPoints] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  const handleStageClick = (e) => {
    if (isFinished) return;
    if (e.target instanceof Konva.Circle) return;

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    if (!pointerPosition) return;

    // scale과 position을 고려한 실제 좌표 계산
    const actualX = (pointerPosition.x - viewPos.x) / scale;
    const actualY = (pointerPosition.y - viewPos.y) / scale;

    const newPoints = [...points, actualX, actualY];
    setPoints(newPoints);
  };

  const handlePointClick = (e) => {
    // 첫 번째 점을 클릭하면 폴리곤 완성
    if (points.length >= 6) {
      // 최소 3개의 점(6개의 좌표)이 있어야 함
      const firstPoint = { x: points[0], y: points[1] };
      const clickedPoint = e.target.position();

      // 첫 번째 점과 클릭한 점 사이의 거리 계산
      const distance = Math.sqrt(
        Math.pow(firstPoint.x - clickedPoint.x, 2) +
          Math.pow(firstPoint.y - clickedPoint.y, 2)
      );

      // 거리가 충분히 가까우면 폴리곤 완성
      if (distance < 20) {
        setIsFinished(true);
      }
    }
  };

  return (
    <Stage onClick={handleStageClick}>
      <ImageLayer />
      <Layer onClick={() => console.log('클릭')}>
        {/* 선 그리기 */}
        <Line
          points={points}
          stroke="#000"
          strokeWidth={2}
          closed={isFinished}
          fill={isFinished ? 'rgba(0, 0, 0, 0.1)' : undefined}
        />

        {/* 점들 그리기 */}
        {Array.from({ length: points.length / 2 }).map((_, i) => (
          <Circle
            key={i}
            x={points[i * 2]}
            y={points[i * 2 + 1]}
            radius={6}
            fill={i === 0 ? '#f00' : '#000'}
            onClick={i === 0 ? handlePointClick : undefined}
          />
        ))}
      </Layer>
    </Stage>
  );
}
