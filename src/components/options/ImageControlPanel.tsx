'use client';

import useFilterStore from '@/stores/useFilterStore';

export default function ImageControlPanel() {
  const { brightness, contrast, setBrightness, setContrast } = useFilterStore();
  return (
    <div className="fixed z-50 left-4 bottom-3 shadow-xl rounded-md px-2 py-1 bg-white">
      <div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={brightness}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          onChange={(e) => setBrightness(Number(e.target.value))}
        />
        <div className="text-sm text-gray-500">Brightness</div>
      </div>
      <div>
        <input
          type="range"
          min="-100"
          max="100"
          step="1"
          value={contrast}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          onChange={(e) => setContrast(Number(e.target.value))}
        />
        <div className="text-sm text-gray-500">Contrast</div>
      </div>
    </div>
  );
}
