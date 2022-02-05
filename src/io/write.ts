import fs from "fs";
import path from "path";

const write = (name: string, dir: string, ext: string, text: string) => {
  const out = path.join(dir, [name, ext].join("."));
  fs.writeFileSync(out, text);
};

export default write;
