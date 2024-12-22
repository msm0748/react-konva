import { PiPolygonLight } from 'react-icons/pi';
import { LiaHandPaper } from 'react-icons/lia';
import { LuMousePointer2 } from 'react-icons/lu';
import useCanvasStore from '@/stores/useCanvasStore';

export default function Tools() {
  const { selectedTool, setSelectedTool } = useCanvasStore();
  return (
    <div className="fixed z-50 left-1/2 transform -translate-x-1/2 top-3 shadow-lg rounded-md px-2 py-1 bg-white">
      <div className="flex gap-1 items-center">
        <Button
          active={selectedTool === 'polygon'}
          onClick={() => setSelectedTool('polygon')}
        >
          <PiPolygonLight size="18px" />
        </Button>
        <Button
          active={selectedTool === 'move'}
          onClick={() => setSelectedTool('move')}
        >
          <LiaHandPaper size="18px" />
        </Button>
        <Button
          active={selectedTool === 'select'}
          onClick={() => setSelectedTool('select')}
        >
          <LuMousePointer2 size="18px" />
        </Button>
      </div>
    </div>
  );
}

interface ButtonProps {
  children: React.ReactNode;
  active: boolean;
  className?: string;
  onClick: () => void;
}

const Button = ({ className, active, onClick, children }: ButtonProps) => {
  return (
    <button
      className={`p-1 rounded-sm ${active && 'bg-blue-200'} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
