export type Tool =
  | 'select'
  | 'move'
  | 'polygon'
  | 'rectangle'
  | 'smartPolygon'
  | 'featurePoint'
  | 'comment';

export type Action =
  | 'none'
  | 'moving'
  | 'drawing'
  | 'updating'
  | 'smart-polygon-negative'
  | 'smart-polygon-positive';

export interface Position {
  x: number;
  y: number;
}

export type MouseCursor =
  | 'auto'
  | 'default'
  | 'none'
  | 'pointer'
  | 'cell'
  | 'crosshair'
  | 'copy'
  | 'move'
  | 'grab'
  | 'grabbing'
  | 'col-resize'
  | 'row-resize'
  | 'nesw-resize'
  | 'nwse-resize'
  | 'not-allowed'
  | 'zoom-in'
  | 'zoom-out';

export interface IPolygon {
  points: number[];
  isFinished: boolean;
}
