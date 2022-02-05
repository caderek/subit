import fs from "fs";
import iconv from "iconv-lite";

const write = (out: string, text: string, encoding: string) => {
  fs.writeFileSync(out, iconv.encode(text, encoding));
};

export default write;
