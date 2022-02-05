const detectFormat = (content: string) => {
  return /\d\d:\d\d:\d\d,\d\d\d --> \d\d:\d\d:\d\d,\d\d\d/.test(content)
    ? ".srt"
    : /{\d+}{\d+}/.test(content)
    ? ".sub"
    : null;
};

export default detectFormat;
