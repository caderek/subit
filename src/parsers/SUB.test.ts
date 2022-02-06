import { stripIndent } from "common-tags";
import { fromSUB, toSUB } from "./SUB";
import { Data } from "../types";

describe("SUB format parser", () => {
  it("Parses basic file", () => {
    const framerate = 100;
    const input = stripIndent`
      {0}{25}Hello!
      {30}{50}World!
      {60}{100}First line.|Second line.|Third.line.
    `;

    const expected = {
      entries: [
        {
          from: 0,
          to: 250,
          lines: [{ text: "Hello!", style: {} }],
          style: {},
          position: undefined,
        },
        {
          from: 300,
          to: 500,
          lines: [{ text: "World!", style: {} }],
          style: {},
          position: undefined,
        },
        {
          from: 600,
          to: 1000,
          lines: [
            { text: "First line.", style: {} },
            { text: "Second line.", style: {} },
            { text: "Third.line.", style: {} },
          ],
          style: {},
          position: undefined,
        },
      ],
      style: {},
    };

    const actual = fromSUB(input, framerate);

    expect(actual).toEqual(expected);
  });

  it("Parses local styling", () => {
    const framerate = 100;
    const input = stripIndent`
      {0}{25}{y:i}Hello!
      {0}{25}{y:i}Hello!|World!
      {0}{25}{y:b}Hello!|{y:u}World!
      {0}{25}{y:s,i,b}Hello!
      {0}{25}{c:$0000FF}{y:i}Hello!|{c:$FF0000}{y:b,u}World!
    `;

    const expected = {
      entries: [
        {
          from: 0,
          to: 250,
          lines: [{ text: "Hello!", style: { fontStyle: ["italic"] } }],
          style: {},
          position: undefined,
        },
        {
          from: 0,
          to: 250,
          lines: [
            { text: "Hello!", style: { fontStyle: ["italic"] } },
            { text: "World!", style: {} },
          ],
          style: {},
          position: undefined,
        },
        {
          from: 0,
          to: 250,
          lines: [
            { text: "Hello!", style: { fontStyle: ["bold"] } },
            { text: "World!", style: { fontStyle: ["underline"] } },
          ],
          style: {},
          position: undefined,
        },
        {
          from: 0,
          to: 250,
          lines: [
            {
              text: "Hello!",
              style: { fontStyle: ["stroke", "italic", "bold"] },
            },
          ],
          style: {},
          position: undefined,
        },
        {
          from: 0,
          to: 250,
          lines: [
            {
              text: "Hello!",
              style: { color: [255, 0, 0], fontStyle: ["italic"] },
            },
            {
              text: "World!",
              style: { color: [0, 0, 255], fontStyle: ["bold", "underline"] },
            },
          ],
          style: {},
          position: undefined,
        },
      ],
      style: {},
    };

    const actual = fromSUB(input, framerate);

    expect(actual).toEqual(expected);
  });

  it("Parses global styling", () => {
    const framerate = 100;
    const input = stripIndent`
      {0}{25}{Y:i}First line.|Second line.|Third line.
      {0}{25}{Y:s,i,b}{C:$00FF00}First line.|Second line.
    `;

    const expected = {
      entries: [
        {
          from: 0,
          to: 250,
          lines: [
            { text: "First line.", style: {} },
            { text: "Second line.", style: {} },
            { text: "Third line.", style: {} },
          ],
          style: { fontStyle: ["italic"] },
          position: undefined,
        },
        {
          from: 0,
          to: 250,
          lines: [
            { text: "First line.", style: {} },
            { text: "Second line.", style: {} },
          ],
          style: {
            fontStyle: ["stroke", "italic", "bold"],
            color: [0, 255, 0],
          },
          position: undefined,
        },
      ],
      style: {},
    };

    const actual = fromSUB(input, framerate);

    expect(actual).toEqual(expected);
  });

  it("Overrides global styling with the local one", () => {
    const framerate = 100;
    const input = stripIndent`
      {0}{25}{Y:i}First line.|{y:b}Second line.|Third line.
    `;

    const expected = {
      entries: [
        {
          from: 0,
          to: 250,
          lines: [
            { text: "First line.", style: {} },
            { text: "Second line.", style: { fontStyle: ["bold"] } },
            { text: "Third line.", style: {} },
          ],
          style: { fontStyle: ["italic"] },
          position: undefined,
        },
      ],
      style: {},
    };

    const actual = fromSUB(input, framerate);

    expect(actual).toEqual(expected);
  });

  it("Parses additional styles", () => {
    const framerate = 100;
    const input = stripIndent`
      {DEFAULT}{C:$FF0000}{F:DeJaVuSans}{S:10}
      {0}{25}{f:Arial}Hello!
      {0}{25}{s:10}Hello!
      {0}{25}{P:20,10}Hello!
    `;

    const expected = {
      entries: [
        {
          from: 0,
          to: 250,
          lines: [{ text: "Hello!", style: { fontName: "Arial" } }],
          style: {},
          position: undefined,
        },
        {
          from: 0,
          to: 250,
          lines: [{ text: "Hello!", style: { size: 10 } }],
          style: {},
          position: undefined,
        },
        {
          from: 0,
          to: 250,
          lines: [{ text: "Hello!", style: {} }],
          style: {},
          position: [20, 10],
        },
      ],
      style: { color: [0, 0, 255], fontName: "DeJaVuSans", size: 10 },
    };

    const actual = fromSUB(input, framerate);

    expect(actual).toEqual(expected);
  });
});

describe("SUB format encoder", () => {
  it("Encodes basic file", () => {
    const framerate = 100;

    const input = {
      entries: [
        {
          from: 0,
          to: 250,
          lines: [{ text: "Hello!", style: {} }],
          style: {},
          position: undefined,
        },
        {
          from: 300,
          to: 500,
          lines: [{ text: "World!", style: {} }],
          style: {},
          position: undefined,
        },
        {
          from: 600,
          to: 1000,
          lines: [
            { text: "First line.", style: {} },
            { text: "Second line.", style: {} },
            { text: "Third.line.", style: {} },
          ],
          style: {},
          position: undefined,
        },
      ],
      style: {},
    };

    const expected = stripIndent`
      {0}{25}Hello!
      {30}{50}World!
      {60}{100}First line.|Second line.|Third.line.
    `;

    const actual = toSUB(input, framerate);

    expect(actual).toEqual(expected);
  });

  it("Encodes local styling", () => {
    const framerate = 100;

    const input: Data = {
      entries: [
        {
          from: 0,
          to: 250,
          lines: [{ text: "Hello!", style: { fontStyle: ["italic"] } }],
          style: {},
          position: undefined,
        },
        {
          from: 0,
          to: 250,
          lines: [
            { text: "Hello!", style: { fontStyle: ["italic"] } },
            { text: "World!", style: {} },
          ],
          style: {},
          position: undefined,
        },
        {
          from: 0,
          to: 250,
          lines: [
            { text: "Hello!", style: { fontStyle: ["bold"] } },
            { text: "World!", style: { fontStyle: ["underline"] } },
          ],
          style: {},
          position: undefined,
        },
        {
          from: 0,
          to: 250,
          lines: [
            {
              text: "Hello!",
              style: { fontStyle: ["stroke", "italic", "bold"] },
            },
          ],
          style: {},
          position: undefined,
        },
        {
          from: 0,
          to: 250,
          lines: [
            {
              text: "Hello!",
              style: { color: [255, 0, 0], fontStyle: ["italic"] },
            },
            {
              text: "World!",
              style: { color: [0, 0, 255], fontStyle: ["bold", "underline"] },
            },
          ],
          style: {},
          position: undefined,
        },
      ],
      style: {},
    };

    const expected = stripIndent`
      {0}{25}{y:i}Hello!
      {0}{25}{y:i}Hello!|World!
      {0}{25}{y:b}Hello!|{y:u}World!
      {0}{25}{y:s,i,b}Hello!
      {0}{25}{c:$0000FF}{y:i}Hello!|{c:$FF0000}{y:b,u}World!
    `;

    const actual = toSUB(input, framerate);

    expect(actual).toEqual(expected);
  });

  it("Encodes global styling", () => {
    const framerate = 100;

    const input: Data = {
      entries: [
        {
          from: 0,
          to: 250,
          lines: [
            { text: "First line.", style: {} },
            { text: "Second line.", style: {} },
            { text: "Third line.", style: {} },
          ],
          style: { fontStyle: ["italic"] },
          position: undefined,
        },
        {
          from: 0,
          to: 250,
          lines: [
            { text: "First line.", style: {} },
            { text: "Second line.", style: {} },
          ],
          style: {
            fontStyle: ["stroke", "italic", "bold"],
            color: [0, 255, 0],
          },
          position: undefined,
        },
      ],
      style: {},
    };

    const expected = stripIndent`
      {0}{25}{Y:i}First line.|Second line.|Third line.
      {0}{25}{Y:s,i,b}{C:$00FF00}First line.|Second line.
    `;

    const actual = toSUB(input, framerate);

    expect(actual).toEqual(expected);
  });

  it("Encodes global and local styling", () => {
    const framerate = 100;

    const input: Data = {
      entries: [
        {
          from: 0,
          to: 250,
          lines: [
            { text: "First line.", style: {} },
            { text: "Second line.", style: { fontStyle: ["bold"] } },
            { text: "Third line.", style: {} },
          ],
          style: { fontStyle: ["italic"] },
          position: undefined,
        },
      ],
      style: {},
    };

    const expected = stripIndent`
      {0}{25}{Y:i}First line.|{y:b}Second line.|Third line.
    `;

    const actual = toSUB(input, framerate);

    expect(actual).toEqual(expected);
  });

  it("Encodes additional styles", () => {
    const framerate = 100;

    const input: Data = {
      entries: [
        {
          from: 0,
          to: 250,
          lines: [{ text: "Hello!", style: { fontName: "Arial" } }],
          style: {},
          position: undefined,
        },
        {
          from: 0,
          to: 250,
          lines: [{ text: "Hello!", style: { size: 10 } }],
          style: {},
          position: undefined,
        },
        {
          from: 0,
          to: 250,
          lines: [{ text: "Hello!", style: {} }],
          style: {},
          position: [20, 10],
        },
      ],
      style: { color: [0, 0, 255], fontName: "DeJaVuSans", size: 10 },
    };

    const expected = stripIndent`
      {DEFAULT}{C:$FF0000}{F:DeJaVuSans}{S:10}
      {0}{25}{f:Arial}Hello!
      {0}{25}{s:10}Hello!
      {0}{25}{P:20,10}Hello!
    `;

    const actual = toSUB(input, framerate);

    expect(actual).toEqual(expected);
  });
});
