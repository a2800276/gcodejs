# GCode JS - statemachine to parse GCode

This package contains a statemachine based parser to parse GCode in node
or (possibly) in the browser.

## Caveats
It's fairly rough around the edges at the moment. No support for
parameters

## Usage

Should be fairly straightforward to use. Require require parser.js:

    var gcode = require("./parser.js")

Afterwards, instantiate the parser, with a callback (see below) and
optional configuration:

    var parser = new gcode.GCode(cb, cfg)

Call `parse` on any data / chunks of data you receive. Typically (see
config, below) `parse` will emit data for each event to the callback adn
return `true` or terminate processing, returning `false` after an error
is encountered and error data is emitted.

    ... get data from somewhere ...
    if (!parser.parse(data)) {
      .. quit parsing ...
    }


### CALLBACK

The callback you pass to the `GCode` constructor will receive data
describing one of the following events:

- BLOCK_START : start of a block (line)
- BLOCK_END   : end of a block (line)
- BLOCK_DEL   : indicates a leading '/'
- WORD        : a complete word, e.g. G00, M02, X12.12
- COMMENT     : the text of a comment
- ERROR       : an error

Data passed to the callback is a hash an will always contain the
following parameters:

- ev : one of `gcode.Events.BLOCK_START`, `...BLOCK_END`, (...)
- line_no : the line currently being processed (line of the file, not
  the line indicated by `N` words.

ERROR events also have the following parameters: `msg` the error message
and `state` which is the internal state of the parser and is only useful
for debugging, this will likely be omitted in the future.

WORD events have the following additional parameters: `code` the letter
part of the word and `value` the value part. Unless you configure the
parser to do otherwise, it will also contain a `desc` parameter with a
humanreadable describtion of the command.

COMMENT contains a parameter called `comment` containing the text of the
comment, stripped of comment delimiters.

### Configuration

The optinal `cfg` parameter that may be passed to the constructor is a
hash which may currently contain two configuration options:

- continue_on_err : don't return `false` from `parse` after an error has
  been emitted, instead, try to recover (this may void your warranty)
- no_annotate     : don't append the `desc` parameter to word events.

## Motivation

This will be part of a JS based CNC control for the Anykey[1]
/Anycnc[2]
## TODO

Write a proper example driver for anycnc ...
Package nicely for npm.

## License

MIT 



## FILES

README.md             : this file
anycnc.js             : example drive, extremly wip
test                  : test fixtures
make_json_fixtures.js : pre-parse fixture data for test
parser.js             : the actual parser
test_gcode.js         : run tests.


[1] http://www.anykey0x.de
[2] http://blog.anykey0x.de/?p=60
