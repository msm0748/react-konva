import { Action, MouseCursor, Position, Tool } from '@/types/Canvas';
import { create } from 'zustand';

interface Props {
  selectedTool: Tool;
  action: Action;
  viewPos: Position;
  scale: number;
  mouseCursor: MouseCursor;
  setSelectedTool: (selectedTool: Tool) => void;
  setAction: (action: Action) => void;
  setViewPos: (position: Position) => void;
  setScale: (scale: number) => void;
  setMouseCursor: (mouseCursor: MouseCursor) => void;
}

const useCanvasStore = create<Props>((set) => ({
  selectedTool: 'select',
  action: 'none',
  viewPos: { x: 0, y: 0 },
  scale: 1,
  mouseCursor: 'default',
  setSelectedTool: (selectedTool) => set({ selectedTool }),
  setAction: (action) => set({ action }),
  setViewPos: (position) => set({ viewPos: position }),
  setScale: (scale) => set({ scale }),
  setMouseCursor: (mouseCursor) => set({ mouseCursor }),
}));

export default useCanvasStore;
