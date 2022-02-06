export type FontStyle = "bold" | "italic" | "underline" | "stroke";

export type Style = {
  fontStyle?: FontStyle[];
  fontName?: string;
  size?: number;
  color?: number[];
};

export type Line = {
  style: Style;
  text: string;
};

export type Entry = {
  from: number;
  to: number;
  lines: Line[];
  position?: [number, number];
  style: Style;
};

export type Data = {
  entries: Entry[];
  style: Style;
};
