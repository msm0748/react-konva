'use client';

import { Layer, Line, Circle } from 'react-konva';
import { useState } from 'react';
import Konva from 'konva';
import ImageLayer from './ImageLayer';
import useCanvasStore from '@/stores/useCanvasStore';
import Stage from './konva/Stage';
import Polygon from './Polygon';
import { IPolygon } from '@/types/Canvas';

export default function Canvas() {
  const { viewPos, scale } = useCanvasStore();

  const [polygons, setPolygons] = useState<IPolygon[]>([]);
  const [currentPolygon, setCurrentPolygon] = useState<number[]>([]);

  const getActualPosition = (pointerPosition: Konva.Vector2d) => {
    return {
      x: (pointerPosition.x - viewPos.x) / scale,
      y: (pointerPosition.y - viewPos.y) / scale,
    };
  };

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Circle을 클릭한 경우 처리
    if (e.target instanceof Konva.Circle) {
      // 첫 번째 점을 클릭하면 폴리곤 완성
      if (
        currentPolygon.length >= 4 && // 최소 2개의 점이 있어야 함 (x,y 좌표 각각 2개)
        Math.abs(e.target.x() - currentPolygon[0]) < 5 &&
        Math.abs(e.target.y() - currentPolygon[1]) < 5
      ) {
        // 현재 폴리곤을 완성하고 저장
        setPolygons((prev) => [
          ...prev,
          { points: [...currentPolygon], isFinished: true },
        ]);
        // 새로운 폴리곤 시작을 위해 초기화
        setCurrentPolygon([]);
        return;
      }
      return;
    }

    const stage = e.target.getStage();
    if (!stage) return;

    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    const { x, y } = getActualPosition(pointerPosition);

    // 현재 그리고 있는 폴리곤에 점 추가
    setCurrentPolygon((prev) => [...prev, x, y]);
  };

  return (
    <Stage onClick={handleStageClick}>
      <ImageLayer />
      <Layer onClick={() => console.log('클릭')}>
        {polygons.map((polygon, index) => (
          <Polygon
            key={index}
            points={polygon.points}
            isFinished={polygon.isFinished}
            setPolygons={setPolygons}
          />
        ))}

        {/* 현재 그리고 있는 폴리곤 렌더링 */}
        {currentPolygon.length > 0 && (
          <>
            <Line
              points={currentPolygon}
              stroke="red"
              strokeWidth={2}
              closed={false}
            />
            {/* 각 점들 렌더링 */}
            {Array.from({ length: currentPolygon.length / 2 }).map((_, i) => (
              <Circle
                key={`point-${i}`}
                x={currentPolygon[i * 2]}
                y={currentPolygon[i * 2 + 1]}
                radius={4}
                fill="red"
                draggable
                onDragMove={(e) => {
                  // 점 드래그 시 위치 업데이트
                  const newPoints = [...currentPolygon];
                  const { x, y } = getActualPosition({
                    x: e.target.x(),
                    y: e.target.y(),
                  });
                  newPoints[i * 2] = x;
                  newPoints[i * 2 + 1] = y;
                  setCurrentPolygon(newPoints);
                }}
              />
            ))}
          </>
        )}
      </Layer>
    </Stage>
  );
}
