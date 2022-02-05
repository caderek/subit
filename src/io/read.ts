import iconv from "iconv-lite";
import fs from "fs";
import path from "path";

const read = (src: string, encoding: string) => {
  if (!fs.existsSync(src)) {
    console.log("File does not exist.");
    process.exit(1);
  }

  const { name, ext, dir } = path.parse(src);
  const lang = name.split(".")[1] ?? "en";
  const bytes = fs.readFileSync(src);
  const content = iconv.decode(bytes, encoding);

  return { content, name, dir, ext, lang };
};

export default read;
