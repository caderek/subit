#!/usr/bin/env node
import { program, Option } from "commander";
import { stripIndent } from "common-tags";

import main from "./actions/main";

program
  .name("subit")
  .version("0.3.0")
  .description(
    stripIndent`
    Subtitles shifter and converter
  
    Recipes:

      Change characters encoding:

        subit -e <from_encoding> -t <to_encoding> <file>
        subit -e win1250 -t utf8 my_file.srt

      Convert between .srt and .sub/.txt formats:

        subit -x <format> -f <framerate> <file>
        subit -x sub -f 25 my_file.srt

      Shift subtitles:

        subit -s <@amount_in_seconds> <file>
        subit -s @+2 my_file.srt

    You can combine all the above in one command and additionally specify custom target file.
  `
  )
  .argument("<source>", "source file (required)")
  .argument("[target]", "target file (optional)")
  .addOption(
    new Option("-e, --encoding <string>", "character encoding").default("utf8")
  )
  .addOption(
    new Option("-t, --target-encoding <string>", "character encoding").default(
      null
    )
  )
  .addOption(
    new Option("-f, --framerate <number>", "video framerate")
      .default(23.98)
      .argParser(Number)
  )
  .addOption(
    new Option("-x, --extension <extension>", "subtitles format")
      .choices(["srt", "sub", "txt"])
      .default(null)
  )
  .addOption(
    new Option(
      "-s, --shift <amount>",
      "time shift in seconds (@+n/@-n)"
    ).default(null)
  )
  .addOption(
    new Option("-b, --backup", "backup the original file").default(false)
  )
  .action(main);

program.parse();
