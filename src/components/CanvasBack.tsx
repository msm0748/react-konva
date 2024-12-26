'use client';

import { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Line, Circle } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';

interface Point {
  x: number;
  y: number;
}

export default function Canvas() {
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [polygons, setPolygons] = useState<Point[][]>([]);
  const [selectedPolygonIndex, setSelectedPolygonIndex] = useState<number>(-1);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number>(-1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef<Point | null>(null);

  const isPointInPolygon = (point: Point, polygon: Point[]): boolean => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x,
        yi = polygon[i].y;
      const xj = polygon[j].x,
        yj = polygon[j].y;

      const intersect =
        yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const distanceToLineSegment = (
    point: Point,
    start: Point,
    end: Point
  ): number => {
    const A = point.x - start.x;
    const B = point.y - start.y;
    const C = end.x - start.x;
    const D = end.y - start.y;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;

    if (len_sq !== 0) {
      param = dot / len_sq;
    }

    let xx, yy;

    if (param < 0) {
      xx = start.x;
      yy = start.y;
    } else if (param > 1) {
      xx = end.x;
      yy = end.y;
    } else {
      xx = start.x + param * C;
      yy = start.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;

    return Math.sqrt(dx * dx + dy * dy);
  };

  const findNearestEdge = (point: Point): [number, number] => {
    const threshold = 10;
    let minDistance = Infinity;
    let nearestPolygon = -1;
    let nearestEdge = -1;

    polygons.forEach((polygon, polygonIndex) => {
      for (let i = 0; i < polygon.length; i++) {
        const start = polygon[i];
        const end = polygon[(i + 1) % polygon.length];
        const distance = distanceToLineSegment(point, start, end);

        if (distance < threshold && distance < minDistance) {
          minDistance = distance;
          nearestPolygon = polygonIndex;
          nearestEdge = i;
        }
      }
    });

    return [nearestPolygon, nearestEdge];
  };

  const findPolygonByPoint = (point: Point): number => {
    for (let i = polygons.length - 1; i >= 0; i--) {
      if (isPointInPolygon(point, polygons[i])) {
        return i;
      }
    }
    return -1;
  };

  const findNearestPoint = (point: Point): [number, number] => {
    const threshold = 10;
    for (let i = 0; i < polygons.length; i++) {
      for (let j = 0; j < polygons[i].length; j++) {
        const dx = polygons[i][j].x - point.x;
        const dy = polygons[i][j].y - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < threshold) {
          return [i, j];
        }
      }
    }
    return [-1, -1];
  };

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;

    const point = stage.getPointerPosition();
    if (!point) return;

    if (e.evt.button === 2) {
      setCurrentPoints([]);
      setIsDrawing(false);
      return;
    }

    if (e.evt.button === 0) {
      if (!isDrawing) {
        const [polygonIndex, pointIndex] = findNearestPoint(point);
        if (polygonIndex !== -1 && pointIndex !== -1) {
          setSelectedPolygonIndex(polygonIndex);
          setSelectedPointIndex(pointIndex);
          setIsDragging(true);
          return;
        }

        const [edgePolygonIndex, edgeIndex] = findNearestEdge(point);
        if (edgePolygonIndex !== -1 && edgeIndex !== -1) {
          const polygon = [...polygons[edgePolygonIndex]];
          polygon.splice(edgeIndex + 1, 0, point);
          const newPolygons = [...polygons];
          newPolygons[edgePolygonIndex] = polygon;
          setPolygons(newPolygons);
          setSelectedPolygonIndex(edgePolygonIndex);
          setSelectedPointIndex(edgeIndex + 1);
          setIsDragging(true);
          return;
        }

        const selectedPolygon = findPolygonByPoint(point);
        if (selectedPolygon !== -1) {
          setSelectedPolygonIndex(selectedPolygon);
          setSelectedPointIndex(-1);
          setIsDragging(true);
          dragStartPos.current = point;
          return;
        }
      }

      setIsDrawing(true);

      if (currentPoints.length >= 3) {
        const firstPoint = currentPoints[0];
        const dx = firstPoint.x - point.x;
        const dy = firstPoint.y - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 20) {
          setPolygons([...polygons, [...currentPoints]]);
          setCurrentPoints([]);
          setIsDrawing(false);
          return;
        }
      }

      setCurrentPoints([...currentPoints, point]);
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;

    const point = stage.getPointerPosition();
    if (!point) return;

    if (isDragging && selectedPolygonIndex !== -1) {
      if (selectedPointIndex !== -1) {
        const newPolygons = [...polygons];
        newPolygons[selectedPolygonIndex][selectedPointIndex] = point;
        setPolygons(newPolygons);
      } else if (dragStartPos.current) {
        const dx = point.x - dragStartPos.current.x;
        const dy = point.y - dragStartPos.current.y;

        const newPolygons = [...polygons];
        newPolygons[selectedPolygonIndex] = polygons[selectedPolygonIndex].map(
          (p) => ({
            x: p.x + dx,
            y: p.y + dy,
          })
        );
        setPolygons(newPolygons);
        dragStartPos.current = point;
      }
      return;
    }

    if (isDrawing && currentPoints.length >= 3) {
      const firstPoint = currentPoints[0];
      const dx = firstPoint.x - point.x;
      const dy = firstPoint.y - point.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Visual feedback will be handled by the render
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartPos.current = null;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Delete' && selectedPolygonIndex !== -1) {
      const newPolygons = [...polygons];
      newPolygons.splice(selectedPolygonIndex, 1);
      setPolygons(newPolygons);
      setSelectedPolygonIndex(-1);
      setSelectedPointIndex(-1);
    } else if (e.key === 'Escape') {
      setCurrentPoints([]);
      setIsDrawing(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPolygonIndex]);

  return (
    <Stage
      width={800}
      height={600}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={(e) => e.evt.preventDefault()}
      style={{ backgroundColor: '#f0f0f0' }}
    >
      <Layer>
        {polygons.map((polygon, index) => (
          <Line
            key={index}
            points={polygon.flatMap((p) => [p.x, p.y])}
            closed={true}
            fill={index === selectedPolygonIndex ? '#00ff00' : '#66ccff'}
            fillOpacity={0.3}
            stroke="#000000"
            strokeWidth={2}
          />
        ))}

        {polygons.map((polygon, polygonIndex) =>
          polygon.map((point, pointIndex) => (
            <Circle
              key={`${polygonIndex}-${pointIndex}`}
              x={point.x}
              y={point.y}
              radius={
                polygonIndex === selectedPolygonIndex &&
                pointIndex === selectedPointIndex
                  ? 6
                  : 4
              }
              fill={
                polygonIndex === selectedPolygonIndex &&
                pointIndex === selectedPointIndex
                  ? '#ff0000'
                  : '#000000'
              }
            />
          ))
        )}

        {currentPoints.length > 0 && (
          <Line
            points={currentPoints.flatMap((p) => [p.x, p.y])}
            stroke="#000000"
            strokeWidth={2}
          />
        )}

        {currentPoints.map((point, index) => (
          <Circle
            key={index}
            x={point.x}
            y={point.y}
            radius={index === 0 && currentPoints.length >= 3 ? 6 : 4}
            fill={
              index === 0 && currentPoints.length >= 3 ? '#00ff00' : '#000000'
            }
          />
        ))}

        {isDrawing && currentPoints.length >= 3 && (
          <Line
            points={[
              currentPoints[currentPoints.length - 1].x,
              currentPoints[currentPoints.length - 1].y,
              currentPoints[0].x,
              currentPoints[0].y,
            ]}
            stroke="#00ff00"
            strokeWidth={2}
          />
        )}
      </Layer>
    </Stage>
  );
}
