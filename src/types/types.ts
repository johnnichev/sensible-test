export type HorizontalDirection = "right" | "left";
export type VerticalDirection = "below" | "above";
export type Direction = HorizontalDirection | VerticalDirection;

export interface BaseMethod {
  id: string;
}

export interface Label extends BaseMethod {
  id: "label";
  position: Direction;
  textAlignment: HorizontalDirection;
  anchor: string;
}

export interface Row extends BaseMethod {
  id: "row";
  position: HorizontalDirection;
  tiebreaker: "first" | "second" | "last";
  anchor: string;
}

export type Polygon = { x: number; y: number }[];

export type StandardizedLine = {
  text: string;
  boundingPolygon: Polygon;
};

export type StandardizedPage = {
  lines: StandardizedLine[];
};

export type StandardizedText = {
  pages: StandardizedPage[];
};

export type LabelExtractor = (
  configuration: Label,
  text: StandardizedText
) => StandardizedLine;

export type RowExtractor = (
  configuration: Row,
  text: StandardizedText
) => StandardizedLine;
