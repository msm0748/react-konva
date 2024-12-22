'use client';

import { Layer, Stage, Text, Image } from 'react-konva';
import ColoredRect from './React';
import useImage from 'use-image';
import { useRef, useState } from 'react';
import Konva from 'konva';

export default function Canvas() {
  const [image] = useImage('https://konvajs.org/assets/lion.png');

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const stageRef = useRef<Konva.Stage>(null);

  const [isDragging, setIsDragging] = useState(false);

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
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
    setIsDragging(true);
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

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      draggable
      ref={stageRef}
      onWheel={handleWheel}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
      scaleX={scale}
      scaleY={scale}
      x={position.x}
      y={position.y}
    >
      <Layer>
        <Image image={image} alt="lion" />
        <Text text="Try click on rect" />
        <ColoredRect />
      </Layer>
    </Stage>
  );
}
