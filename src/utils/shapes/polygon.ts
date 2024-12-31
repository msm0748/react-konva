import { LinePoint, Position } from '@/types/Canvas';

/**
 * 두 점 사이의 거리를 계산합니다.
 * @param p1 첫 번째 점
 * @param p2 두 번째 점
 * @returns 두 점 사이의 거리
 */
export const getDistance = (p1: Position, p2: Position): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

/**
 * 점과 선 사이의 거리를 계산합니다.
 * @param point 계산할 점
 * @param lineStart 선의 시작점
 * @param lineEnd 선의 끝점
 * @returns 선과 점 사이의 거리, 선 위의 위치, 선 위의 위치의 매개변수
 */
export const getDistanceFromPointToLine = (
  point: Position,
  lineStart: Position,
  lineEnd: Position
): LinePoint => {
  // 점과 선의 시작점 사이의 x, y 차이
  const A = point.x - lineStart.x;
  const B = point.y - lineStart.y;
  // 선의 시작점과 끝점 사이의 x, y 차이
  const C = lineEnd.x - lineStart.x;
  const D = lineEnd.y - lineStart.y;

  // 점과 선 사이의 내적
  const dot = A * C + B * D;
  // 선의 길이 제곱
  const lenSq = C * C + D * D;
  // 선 위의 위치의 매개변수 초기화
  let param = -1;

  // 선의 길이가 0이 아닌 경우, 매개변수 계산
  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  // 선 위의 x, y 좌표 초기화
  let xx: number;
  let yy: number;

  // 매개변수가 0보다 작은 경우, 선의 시작점으로 설정
  if (param < 0) {
    xx = lineStart.x;
    yy = lineStart.y;
  }
  // 매개변수가 1보다 큰 경우, 선의 끝점으로 설정
  else if (param > 1) {
    xx = lineEnd.x;
    yy = lineEnd.y;
  }
  // 매개변수가 0과 1 사이인 경우, 선 위의 위치 계산
  else {
    xx = lineStart.x + param * C;
    yy = lineStart.y + param * D;
  }

  // 결과 반환
  return {
    distance: getDistance(point, { x: xx, y: yy }),
    position: { x: xx, y: yy },
    param,
  };
};
