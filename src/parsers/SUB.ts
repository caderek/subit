import { Entry, Style, FontStyle, Data } from "../types";
import { framesFromMilliseconds, framesToMilliseconds } from "./time";

const defaultSectionRegex = /{DEFAULT}/;
const controlSectionRegex = /^({[^}]+})+/;
const controlCodesRegex = /{[^}]+}/g;
const framesRegex = /{\d+}/g;

const fontStyles: { [key: string]: string } = {
  i: "italic",
  b: "bold",
  s: "stroke",
  u: "underline",
};

const parseFontStyle = (value: string) =>
  value
    .split(",")
    .map((x) => fontStyles[x.trim().toLocaleLowerCase()])
    .filter(Boolean) as FontStyle[];

const parseColor = (value: string) => {
  if (!/^\$[0-9a-f]{6}$/i.test(value)) {
    return;
  }

  return [
    parseInt(value.slice(5, 7), 16),
    parseInt(value.slice(3, 5), 16),
    parseInt(value.slice(1, 3), 16),
  ];
};

const parseSize = (value: string) => {
  const size = Number(value);

  if (Number.isNaN(size) || size <= 0) {
    return;
  }

  return size;
};

const parsePosition = (value: string) => {
  const [x, y] = value.split(",").map((v) => Number(v.trim()));

  if (Number.isNaN(x) || Number.isNaN(y)) {
    return;
  }

  return [x, y] as [number, number];
};

const parseControls = (controls: string[]) => {
  const localStyle: Style = {};
  const globalStyle: Style = {};
  let position: [number, number] | undefined = undefined;

  controls.forEach((control) => {
    const [code, value] = control
      .slice(1, -1)
      .split(":")
      .map((x) => x.trim());

    switch (code) {
      case "y":
        localStyle.fontStyle = parseFontStyle(value);
        break;
      case "Y":
        globalStyle.fontStyle = parseFontStyle(value);
        break;
      case "c":
        localStyle.color = parseColor(value);
        break;
      case "C":
        globalStyle.color = parseColor(value);
        break;
      case "f":
        localStyle.fontName = value.trim();
        break;
      case "F":
        globalStyle.fontName = value.trim();
        break;
      case "s":
        localStyle.size = parseSize(value);
        break;
      case "S":
        globalStyle.size = parseSize(value);
        break;
      case "P":
        position = parsePosition(value);
        break;
    }
  });

  return { localStyle, globalStyle, position };
};

const parseLines = (lines: string[]) => {
  let globalStyle: Style = {};
  let position: [number, number] | undefined = undefined;

  const parsed = [];

  for (const line of lines) {
    const controlsSection = (line.match(controlSectionRegex) ?? [])[0] ?? "";
    const text = line.replace(controlSectionRegex, "");

    const controls = controlsSection.match(controlCodesRegex) ?? [];
    const controlsData = parseControls(controls);

    globalStyle = { ...globalStyle, ...controlsData.globalStyle };
    position = controlsData.position ?? position;

    parsed.push({
      text,
      style: controlsData.localStyle,
    });
  }

  return { lines: parsed, style: globalStyle, position };
};

const fromSUB = (sub: string, frameRate = 23.98): Data => {
  const entries = sub
    .trim()
    .split(/\r?\n/)
    .filter((entry) => entry.trim() !== "");

  const parsed: Entry[] = [];
  let defaultStyle: Style = {};

  entries.forEach((entry, i) => {
    if (defaultSectionRegex.test(entry)) {
      const controls = entry.match(controlCodesRegex) ?? [];
      defaultStyle = parseControls(controls).globalStyle;

      return;
    }

    const controlSection = (entry.match(controlSectionRegex) ?? [])[0];

    if (!controlSection) {
      console.log(`Incorrect subtitles at line ${i + 1}`);
      process.exit(1);
    }

    const [rawFrom, rawTo] = entry.match(framesRegex) ?? [];

    const { lines, position, style } = parseLines(
      entry.replace(framesRegex, "").split("|")
    );

    const fromFrame = Number(rawFrom.slice(1, -1));
    const toFrame = Number(rawTo.slice(1, -1));

    parsed.push({
      from: framesToMilliseconds(fromFrame, frameRate),
      to: framesToMilliseconds(toFrame, frameRate),
      lines,
      style,
      position,
    });
  });

  return { entries: parsed, style: defaultStyle };
};

const styleToCodes = (style: Style, global: boolean) => {
  let codes = "";

  for (const [key, value] of Object.entries(style)) {
    if (value !== undefined) {
      switch (key) {
        case "fontStyle": {
          const val = (value as FontStyle[]).map((style) => style[0]).join(",");

          codes += `{${global ? "Y" : "y"}:${val}}`;
          break;
        }
        case "fontName": {
          codes += `{${global ? "F" : "f"}:${value}}`;
          break;
        }
        case "size": {
          codes += `{${global ? "S" : "s"}:${value}}`;
          break;
        }
        case "color": {
          const val = (value as number[])
            .reverse()
            .map((v) => v.toString(16).padStart(2, "0").toUpperCase())
            .join("");

          codes += `{${global ? "C" : "c"}:$${val}}`;
          break;
        }
      }
    }
  }

  return codes;
};

const toSUB = (data: Data, frameRate = 23.98) => {
  const content: string[] = [];

  if (Object.keys(data.style).length > 0) {
    content.push(`{DEFAULT}${styleToCodes(data.style, true)}`);
  }

  data.entries.forEach(({ from, to, lines, position, style }) => {
    const entry: string[] = [];

    entry.push(`{${framesFromMilliseconds(from, frameRate)}}`);
    entry.push(`{${framesFromMilliseconds(to, frameRate)}}`);

    if (position) {
      entry.push(`{P:${position[0]},${position[1]}}`);
    }

    if (Object.keys(style).length > 0) {
      entry.push(styleToCodes(style, true));
    }

    const text = lines
      .map((line) => {
        const codes = styleToCodes(line.style, false);
        return `${codes}${line.text}`;
      })
      .join("|");

    entry.push(text);

    content.push(entry.join(""));
  });

  return content.join("\n");
};

export { fromSUB, toSUB };
