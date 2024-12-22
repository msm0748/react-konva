import { Image, Layer } from 'react-konva';
import useImage from 'use-image';

export default function ImageLayer() {
  const [image] = useImage('https://konvajs.org/assets/lion.png');
  return (
    <Layer>
      <Image image={image} alt="lion" />
    </Layer>
  );
}
