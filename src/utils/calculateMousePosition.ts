import useCanvasStore from '@/stores/useCanvasStore';
import { Position } from '@/types/Canvas';

/**
 * 캔버스 상의 상대적인 마우스 위치를 계산합니다.
 * @param point 마우스의 절대적인 위치
 * @returns [x, y] 형식으로 반환되는 상대적인 마우스 위치
 */
export const calculateRelativeMousePosition = (point: Position) => {
  // useCanvasStore에서 현재 뷰의 위치와 스케일을 가져옵니다.
  const { viewPos, scale } = useCanvasStore.getState();

  // 마우스의 X축과 Y축 오프셋을 뷰의 위치에서 뺀 후, 스케일로 나누어 상대적인 위치를 계산합니다.
  // 이를 통해 마우스의 위치를 캔버스 상의 실제 위치에서 상대적인 위치로 변환합니다.
  const x = (point.x - viewPos.x) / scale;
  const y = (point.y - viewPos.y) / scale;

  // 계산된 상대적인 X, Y 좌표를 배열로 반환합니다.
  // 반환된 배열은 [x, y] 형식으로, x는 상대적인 X축 좌표, y는 상대적인 Y축 좌표를 나타냅니다.
  return [x, y];
};
