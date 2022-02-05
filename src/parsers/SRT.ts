import { Entry } from "../types";
import { fromMilliseconds, toMilliseconds } from "./time";

const fromSRT = (srt: string) => {
  return srt
    .trim()
    .split("\n\n")
    .map((entry: string) => {
      const [_, time, ...lines] = entry.split("\n");
      const [from, to] = time.split(" --> ");

      return {
        from: toMilliseconds(from),
        to: toMilliseconds(to),
        text: lines.join("\n"),
      };
    });
};

const toSRT = (entries: Entry[]) => {
  return entries
    .map(({ from, to, text }, i) => {
      return [
        i + 1,
        `${fromMilliseconds(from)} --> ${fromMilliseconds(to)}`,
        text,
      ].join("\n");
    })
    .join("\n\n");
};

export { fromSRT, toSRT };
