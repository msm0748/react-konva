import { Action, MouseCursor, Position, Tool } from '@/types/Canvas';
import { create } from 'zustand';

interface CanvasStore {
  selectedTool: Tool;
  action: Action;
  position: Position;
  scale: number;
  mouseCursor: MouseCursor;
  setSelectedTool: (selectedTool: Tool) => void;
  setAction: (action: Action) => void;
  setPosition: (position: Position) => void;
  setScale: (scale: number) => void;
  setMouseCursor: (mouseCursor: MouseCursor) => void;
}

const useCanvasStore = create<CanvasStore>((set) => ({
  selectedTool: 'select',
  action: 'none',
  position: { x: 0, y: 0 },
  scale: 1,
  mouseCursor: 'default',
  setSelectedTool: (selectedTool) => set({ selectedTool }),
  setAction: (action) => set({ action }),
  setPosition: (position) => set({ position }),
  setScale: (scale) => set({ scale }),
  setMouseCursor: (mouseCursor) => set({ mouseCursor }),
}));

export default useCanvasStore;
