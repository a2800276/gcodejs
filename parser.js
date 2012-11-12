
var EVENTS = {
   BLOCK_START : "BLOCK_START"
  ,BLOCK_END   : "BLOCK_END"
  ,WORD        : "WORD"
  ,COMMENT     : "COMMENT"
  ,ERROR       : "ERROR"
}

var CONST = {
   A : "A".charCodeAt(0)
  ,Z : "Z".charCodeAt(0)
  ,re_num: /^[\d-+\.]+$/
  ,re_pcom: /\([^)]*\)/g  // comments in parens
  ,re_scom: /;.*$/        // comments ; semicolon to end of line
}

function trim(str) {
  return str.replace(/^\s+|\s+$/g, '')
}
function toLines(data) {
  var l = trim(data.toString())
  return l.split(/[\r\n]+/)
}

var GCode = function (cb, halt_on_error) {
  var self = this

  var cb = cb
  var halt_on_error = halt_on_error

  var line_no
  function error(msg) {
    cb({
       ev   : EVENTS.ERROR
      ,line : line_no+1
      ,msg  : msg
    }) 
  }
  function handleComments(line) {
    var m = line.match(CONST.re_scom)
    var comments = []
    if (m) {
      comments.push(m[0])
      line = line.replace(CONST.re_scom, '')
    }
    m = line.match(CONST.re_pcom)
    if (m) {
      comments = comments.concat(m)
      line = line.replace(CONST.re_pcom, '')
    }
    comments.forEach(function(comment){
      cb({
         ev: EVENTS.COMMENT
        ,comment: comment
      })
    })
    return line.length != 0 ? trim(line) : null 
  }

  this.parse = function parse(data) {

    function checkUpcaseAtoZ(letter) {
      var c = letter.charCodeAt(0)
      if (CONST.A <= c && c <= CONST.Z) {
        return true
      }
      error("invalid code: "+letter)
      return false
    }
    
    function checkValue(value) {
      if (value.match(CONST.re)) {
        return true
      }
      error("invalid value: "+value)
      return false
    }

    var lines = toLines(data)
LOOPLINES:
    for (var i = 0 ; i != lines.length ; ++i) {
      line_no = i
      var line = lines[i]
      cb({
         ev:   EVENTS.BLOCK_START
        ,line: line
      })

      if (! (line = handleComments(line)) ) {
        continue LOOPLINES
      }

      var words = line.split(/\s+/)
     
      for (var j = 0; j!= words.length; ++j) {
        var word = words[j]
        var letter = word[0]
        if (!checkUpcaseAtoZ(letter) && halt_on_error) {
          break LOOPLINES
        }
        var value = word.substr(1,word.length)
        if (!checkValue(value) && halt_on_error) {
          break LOOPLINES
        }
        cb({
           ev:   EVENTS.WORD
          ,code: letter
          ,value:parseFloat(value)
        })
      }
      cb({ev: EVENTS.BLOCK_END})
    }
  }
}
var p = console.log

//console.log(process.argv.pop())
var fn = process.argv.pop()
var fs = require("fs")
var data = fs.readFileSync(fn)
var parser = new GCode(p)
parser.parse(data, p)



