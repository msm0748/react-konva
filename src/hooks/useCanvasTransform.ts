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

    // cmd(macOS) 또는 ctrl(Windows) 키가 눌렸는지 확인
    const isZoomAction = e.evt.metaKey || e.evt.ctrlKey;

    if (isZoomAction) {
      // 확대/축소 로직
      const stage = e.target.getStage();
      const oldScale = scale;
      const scaleBy = 1.1;
      const newScale =
        e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

      const pointer = stage?.getPointerPosition();
      if (!pointer) return;

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
    } else {
      // 상하 스크롤 로직
      setPosition({
        x: position.x,
        y: position.y - e.evt.deltaY,
      });
    }
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
