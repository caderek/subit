import iconv from "iconv-lite";
import fs from "fs";
import path from "path";

const encodings: { [key: string]: string } = {
  pl: "win1250",
  en: "utf8",
};

const read = (src: string, encoding = null) => {
  const { name, ext, dir } = path.parse(src);
  const lang = name.split(".")[1] ?? "en";
  const bytes = fs.readFileSync(src);
  const content = iconv.decode(bytes, encoding ?? encodings[lang] ?? "utf8");

  return { content: content.slice(0, 20), name, dir, ext, lang };
};

export default read;
