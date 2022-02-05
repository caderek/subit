import { fromSRT, toSRT } from "./parsers/SRT";
import { fromSUB, toSUB } from "./parsers/SUB";
import shiftSubtitles from "./actions/shiftSubtitles";

export { fromSRT, toSRT, fromSUB, toSUB, shiftSubtitles };

export default {
  fromSRT,
  toSRT,
  fromSUB,
  toSUB,
  shiftSubtitles,
};
