#!/usr/bin/env node

import read from "./io/read";
import write from "./io/write";
import { fromSRT, toSRT } from "./parsers/SRT";
import { fromSUB, toSUB } from "./parsers/SUB";
