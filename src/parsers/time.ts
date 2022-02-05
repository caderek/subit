const msInH = 1000 * 60 * 60;
const msInM = 1000 * 60;
const msInS = 1000;

const toMilliseconds = (time: string) => {
  const [h, m, s, ms] = (time.match(/\d\d+/g) ?? []).map(Number);

  return ms + s * msInS + m * msInM + h * msInH;
};

const fromMilliseconds = (ms: number) => {
  const h = Math.floor(ms / msInH);
  const m = Math.floor((ms - h * msInH) / msInM);
  const s = Math.floor((ms - h * msInH - m * msInM) / msInS);
  const rest = ms - h * msInH - m * msInM - s * msInS;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(
    s
  ).padStart(2, "0")},${String(rest).padStart(3, "0")}`;
};

const framesToMilliseconds = (frames: number, frameRate: number) => {
  return Math.round((frames / frameRate) * msInS);
};

const framesFromMilliseconds = (ms: number, frameRate: number) => {
  return Math.round(frameRate * (ms / msInS));
};

export {
  fromMilliseconds,
  toMilliseconds,
  framesFromMilliseconds,
  framesToMilliseconds,
};
