'use client';

import useCanvasStore from '@/stores/canvasStore';
import Konva from 'konva';
import { useEffect, useState } from 'react';

export default function useCanvasTransform() {
  const { scale, setScale, position, setPosition, selectedTool } =
    useCanvasStore();
  const [isDragging, setIsDragging] = useState(false);
  const [draggable, setDraggable] = useState(false);

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    const oldScale = scale;

    // 마우스 휠 방향에 따라 확대/축소 비율 조정
    const scaleBy = 1.1;
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    // 스테이지의 포인터 위치 가져오기
    const pointer = stage?.getPointerPosition();

    if (!pointer) return;

    // 현재 마우스 포인터 위치에서의 확대/축소를 위한 오프셋 계산
    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setScale(newScale);
    setPosition(newPos);
  };

  const handleDragStart = () => {
    if (draggable) setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!isDragging) return;
    // 새로운 위치 계산
    setPosition({
      x: e.currentTarget.x(),
      y: e.currentTarget.y(),
    });
  };

  useEffect(() => {
    if (selectedTool === 'move') {
      setDraggable(true);
    } else {
      setDraggable(false);
    }
  }, [selectedTool]);

  return {
    handleWheel,
    handleDragStart,
    handleDragEnd,
    handleDragMove,
    draggable,
  };
}
