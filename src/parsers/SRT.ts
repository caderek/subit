import { Entry, Data } from "../types";
import { fromMilliseconds, toMilliseconds } from "./time";

const fromSRT = (srt: string): Data => {
  const entries = srt
    .trim()
    .split(/\r?\n\r?\n/)
    .filter((line) => line.trim() !== "")
    .map((entry) => {
      const [_, time, ...lines] = entry.trim().split(/\r?\n/);
      const [from, to] = time.split(" --> ");

      return {
        from: toMilliseconds(from),
        to: toMilliseconds(to),
        lines: lines.map((text) => ({ text, style: {} })),
        style: {},
        position: undefined,
      };
    });

  return { entries, style: {} };
};

const toSRT = (data: Data) => {
  return data.entries
    .map(({ from, to, lines, position, style }, i) => {
      return [
        i + 1,
        `${fromMilliseconds(from)} --> ${fromMilliseconds(to)}`,
        ...lines.map((line) => line.text),
      ].join("\n");
    })
    .join("\n\n");
};

export { fromSRT, toSRT };
