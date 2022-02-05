import { Entry } from "../types";
import { fromMilliseconds, toMilliseconds } from "./time";

const fromSRT = (srt: string) => {
  console.log(srt.trim().split(/(\r?\n){2,}/));

  return srt
    .trim()
    .split(/\r?\n\r?\n/)
    .filter((line) => line.trim() !== "")
    .map((entry) => {
      const [_, time, ...lines] = entry.trim().split(/\r?\n/);
      const [from, to] = time.split(" --> ");

      console.log({ entry });

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
