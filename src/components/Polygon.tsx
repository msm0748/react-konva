'use client';

import { IPolygon } from '@/types/Canvas';
import { KonvaEventObject } from 'konva/lib/Node';
import { Line, Circle, Group } from 'react-konva';

interface Props {
  points: number[];
  isFinished: boolean;
  setPolygons: React.Dispatch<React.SetStateAction<IPolygon[]>>;
}

export default function Polygon({ points, isFinished, setPolygons }: Props) {
  const handlePointClick = (e: KonvaEventObject<MouseEvent>) => {
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
        setPolygons((prev) => [
          ...prev,
          {
            points: [
              ...prev[prev.length - 1].points,
              clickedPoint.x,
              clickedPoint.y,
            ],
            isFinished: true,
          },
        ]);
      }
    }
  };
  return (
    <Group draggable onDragStart={() => console.log('start')}>
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
          onClick={handlePointClick}
          draggable
        />
      ))}
    </Group>
  );
}
