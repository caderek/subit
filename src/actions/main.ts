import path from "path";
import fs from "fs";

import read from "../io/read";
import write from "../io/write";
import { fromSRT, toSRT } from "../parsers/SRT";
import { fromSUB, toSUB } from "../parsers/SUB";
import shiftSubtitles from "./shiftSubtitles";
import detectFormat from "../parsers/detectFormat";

type Options = {
  encoding: string;
  targetEncoding: string | null;
  framerate: number;
  extension: "srt" | "sub" | "txt" | null;
  shift: string | null;
  backup: boolean;
};

const main = (source: string, target: string | undefined, options: Options) => {
  const data = read(source, options.encoding);

  if (data.ext !== ".srt" && data.ext !== ".sub") {
    const ext = detectFormat(data.content);

    if (ext === null) {
      console.log("Unknown format.");
      process.exit(1);
    }

    data.ext = ext;
  }

  const targetFormat =
    options.extension ??
    (target ? path.parse(target).ext.slice(1) : data.ext.slice(1));

  const shift = options.shift
    ? Number(options.shift.slice(1).replace(",", "."))
    : null;

  const entries =
    data.ext === ".srt"
      ? fromSRT(data.content)
      : fromSUB(data.content, options.framerate);

  const shiftedEntries = shift ? shiftSubtitles(entries, shift) : entries;

  const targetFile =
    target ?? path.join(data.dir, [data.name, targetFormat].join("."));

  const newContent =
    targetFormat === "srt"
      ? toSRT(shiftedEntries)
      : toSUB(shiftedEntries, options.framerate);

  if (!target && options.backup && targetFormat === data.ext.slice(1)) {
    fs.copyFileSync(source, `${source}.bak`);
  }

  write(targetFile, newContent, options.targetEncoding ?? options.encoding);
};

export default main;
