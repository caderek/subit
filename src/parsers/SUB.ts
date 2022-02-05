import { Entry } from "../types";
import { framesFromMilliseconds, framesToMilliseconds } from "./time";

const fromSUB = (sub: string, frameRate = 23.98) => {
  const entries = sub
    .trim()
    .split(/\r?\n/)
    .map((line) => {
      const [rawFrom, rawTo] = line.match(/{\d+}/g) ?? [];
      const text = line.replace(/{\d+}/g, "").replace("|", "\n");

      return {
        from: framesToMilliseconds(Number(rawFrom.slice(1, -1)), frameRate),
        to: framesToMilliseconds(Number(rawTo.slice(1, -1)), frameRate),
        text,
      };
    });

  return entries;
};

const toSUB = (entries: Entry[], frameRate = 23.98) => {
  return entries
    .map(({ from, to, text }) => {
      const fromFrame = framesFromMilliseconds(from, frameRate);
      const toFrame = framesFromMilliseconds(to, frameRate);
      return `{${fromFrame}}{${toFrame}}${text.replace("\n", "|")}`;
    })
    .join("\n");
};

export { fromSUB, toSUB };
