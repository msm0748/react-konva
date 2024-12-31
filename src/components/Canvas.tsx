'use client';

import { Layer } from 'react-konva';
import { useState } from 'react';
import ImageLayer from './ImageLayer';
import useCanvasStore from '@/stores/useCanvasStore';
import Stage from './konva/Stage';
import Polygon from './Polygon';
import { Action, Position } from '@/types/Canvas';
import { KonvaEventObject } from 'konva/lib/Node';
import { getDistance } from '@/utils/shapes/polygon';

export default function Canvas() {
  const { viewPos, scale, selectedTool } = useCanvasStore();

  console.log(selectedTool, 'selectedTool');

  const [points, setPoints] = useState<Position[]>([]);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const [action, setAction] = useState<Action>('none');

  /**
   * 스테이지에서 마우스 업 이벤트를 처리합니다.
   * @param e 마우스 업 이벤트 객체.
   */
  const handleStageMouseDown = (e: KonvaEventObject<MouseEvent>): void => {
    if (selectedTool !== 'polygon') return;

    setAction('drawing');

    // 타겟이 원(Circle)인 경우 또는 다각형이 완성된 경우 아무 작업도 수행하지 않습니다.
    if (e.target.className === 'Circle' || isComplete) {
      return;
    }

    // 이벤트가 발생한 스테이지를 가져옵니다.
    const stage = e.target.getStage();
    // 스테이지가 없으면 아무 작업도 수행하지 않습니다.
    if (!stage) return;

    // 마우스 포인터의 현재 위치를 가져옵니다.
    const pointerPosition = stage.getPointerPosition();
    // 포인터 위치가 없으면 아무 작업도 수행하지 않습니다.
    if (!pointerPosition) return;

    // 포인터 위치의 x, y 좌표를 추출합니다.
    const { x, y } = pointerPosition;

    // 현재 점이 2개 이상이고, 첫 번째 점과 마우스 업 위치 간의 거리가 10보다 작은 경우 다각형을 완성으로 설정합니다.
    if (points.length >= 2) {
      const firstPoint = points[0];
      const distance = getDistance(firstPoint, { x, y });

      if (distance < 10) {
        setIsComplete(true);
        setAction('none');
        return;
      }
    }

    // 새로운 점을 현재 점들에 추가합니다.
    setPoints([...points, { x: x - viewPos.x, y: y - viewPos.y }]);
  };

  return (
    <Stage onMouseDown={handleStageMouseDown}>
      <ImageLayer />
      <Layer>
        <Polygon
          points={points}
          isComplete={isComplete}
          setIsComplete={setIsComplete}
          setPoints={setPoints}
          action={action}
          setAction={setAction}
        />
      </Layer>
    </Stage>
  );
}
