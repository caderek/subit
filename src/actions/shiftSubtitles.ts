import { Entry } from "../types";

const shiftSubtitles = (entries: Entry[], amount: number) => {
  return entries.map(({ from, to, text }) => ({
    from: from + Math.round(amount * 1000),
    to: to + Math.round(amount * 1000),
    text,
  }));
};

export default shiftSubtitles;
