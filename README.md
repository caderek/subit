# SUBIT - Subtitles shifter and converter

## CLI usage

```
Usage: subit [options] <source> [target]

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

Arguments:
  source                          source file (required)
  target                          target file (optional)

Options:
  -V, --version                   output the version number
  -e, --encoding <string>         character encoding (default: "utf8")
  -t, --target-encoding <string>  character encoding (default: null)
  -f, --framerate <number>        video framerate (default: 23.98)
  -x, --extension <extension>     subtitles format (choices: "srt", "sub", "txt", default: null)
  -s, --shift <amount>            time shift in seconds (@+n/@-n) (default: null)
  -b, --backup                    backup the original file (default: false)
  -h, --help                      display help for command
```

## LICENSE

Project is under open, non-restrictive [ISC license](LICENSE.md).
