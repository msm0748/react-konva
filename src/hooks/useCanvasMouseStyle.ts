'use client';

import useCanvasStore from '@/stores/useCanvasStore';
import { useEffect } from 'react';

export default function useCanvasMouseStyle() {
  const { selectedTool, mouseCursor, setMouseCursor } = useCanvasStore();
  useEffect(() => {
    switch (selectedTool) {
      case 'select':
        setMouseCursor('auto');
        break;
      case 'move':
        setMouseCursor('grab');
        break;
      case 'polygon':
        setMouseCursor('crosshair');
        break;
      default:
        setMouseCursor('default');
    }
  }, [selectedTool, setMouseCursor]);

  return mouseCursor;
}
