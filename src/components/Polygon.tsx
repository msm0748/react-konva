'use client';

import useCanvasStore from '@/stores/useCanvasStore';
import { Action, Position } from '@/types/Canvas';
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
  setAction,
}: Props) {
  const { viewPos, selectedTool } = useCanvasStore();
  const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);

  /**
   * 선을 클릭했을 때 발생하는 이벤트 핸들러.
   * 다각형이 완성된 상태에서 선을 클릭하면, 클릭한 위치에 새로운 점을 추가합니다.
   * @param e KonvaEventObject<MouseEvent> 이벤트 객체.
   */
  const handleLineMouseDown = (e: KonvaEventObject<MouseEvent>): void => {
    if (selectedTool !== 'select') return;

    // 이벤트 전파를 중단합니다.
    e.cancelBubble = true;

    // 다각형이 완성되지 않았으면 아무것도 하지 않고 함수를 종료합니다.
    if (!isComplete) return;

    // 클릭된 선의 스테이지를 가져옵니다.
    const stage = e.target.getStage();
    // 스테이지가 없으면 아무것도 하지 않고 함수를 종료합니다.
    if (!stage) return;

    // 클릭한 위치를 가져옵니다.
    let clickPoint = stage.getPointerPosition();
    // 클릭한 위치가 없으면 아무것도 하지 않고 함수를 종료합니다.
    if (!clickPoint) return;

    // viewPos를 제거하고 클릭 포인트에서 viewPos를 빼줍니다
    clickPoint = {
      x: clickPoint.x - viewPos.x,
      y: clickPoint.y - viewPos.y,
    };

    // 최소 거리, 삽입할 인덱스, 삽입할 점을 초기화합니다.
    let minDistance = Infinity;
    let insertIndex = -1;
    let insertPoint: Position | null = null;

    // 모든 점을 순회합니다.
    for (let i = 0; i < points.length; i++) {
      // 시작점과 끝점을 정의합니다.
      const start = points[i];

      const end = points[(i + 1) % points.length];

      // 클릭한 위치에서 선까지의 거리를 계산합니다.
      const result = getDistanceFromPointToLine(clickPoint, start, end);

      // 계산된 거리가 최소 거리보다 작은 경우, 최소 거리와 삽입할 인덱스를 업데이트합니다.
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

    // 최소 거리가 10보다 작은 경우, 즉 클릭한 위치가 선에 가까운 경우, 새로운 점을 삽입합니다.
    if (minDistance < 10 && insertPoint) {
      // 새로운 점을 삽입할 위치에 삽입합니다.
      const newPoints = [...points];
      newPoints.splice(insertIndex, 0, insertPoint);
      setPoints(newPoints);
      // 드래그 시작 인덱스를 업데이트합니다.
      setDragStartIndex(insertIndex);
      setAction('updating');
    }
  };

  /**
   * 원을 클릭했을 때 발생하는 이벤트 핸들러.
   * 첫 번째 원을 클릭하고 점이 2개 이상일 때 다각형을 완성으로 설정합니다.
   * @param index 클릭된 원의 인덱스.
   */
  const handleCircleMouseDown = (index: number): void => {
    if (index === 0 && points.length >= 2) {
      setIsComplete(true);
    }
  };

  const handleDragStart = (): void => {
    if (selectedTool !== 'select') return;
    setAction('updating');
  };

  // 드래그 이동 이벤트 핸들러
  const handleDragMove = (
    e: KonvaEventObject<DragEvent>, // 드래그 이벤트 객체
    index: number // 드래그하는 점의 인덱스
  ): void => {
    const point = e.target; // 드래그 대상 점
    const newPoints = [...points]; // 기존 점들을 복사
    newPoints[index] = {
      // 드래그하는 점의 위치를 업데이트
      x: point.x(),
      y: point.y(),
    };
    setPoints(newPoints); // 점들을 업데이트
  };

  /**
   * 드래그가 끝났을 때 호출되는 이벤트 핸들러.
   * 드래그가 끝난 점의 위치를 업데이트하고, 드래그 상태를 비활성화합니다.
   * @param e 드래그 이벤트 객체.
   * @param index 드래그가 끝난 점의 인덱스.
   */
  const handleDragEnd = (
    e: KonvaEventObject<DragEvent>,
    index: number
  ): void => {
    const point = e.target; // 드래그가 끝난 점을 가져옵니다.
    const newPoints = [...points]; // 기존 점들을 복사합니다.
    newPoints[index] = {
      // 드래그가 끝난 점의 위치를 업데이트합니다.
      x: point.x(),
      y: point.y(),
    };
    setPoints(newPoints); // 업데이트된 점들을 설정합니다.
    setAction('none');
  };

  return (
    <>
      <Line
        points={points.flatMap((point) => [point.x, point.y])}
        stroke="#000000"
        strokeWidth={2}
        closed={isComplete}
        onMouseDown={handleLineMouseDown}
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
          draggable={selectedTool === 'select'}
          onDragStart={handleDragStart}
          onDragMove={(e) => handleDragMove(e, index)}
          onDragEnd={(e) => handleDragEnd(e, index)}
          onMouseDown={() => handleCircleMouseDown(index)}
          ref={
            index === dragStartIndex
              ? (node) => {
                  if (node) {
                    // 노드를 드래그 시작합니다.
                    node.startDrag();
                    // 드래그 시작 인덱스를 null로 설정합니다.
                    setDragStartIndex(null);
                  }
                }
              : // 그렇지 않을 때는 ref를 undefined로 설정합니다.
                undefined
          }
        />
      ))}
    </>
  );
}
