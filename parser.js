
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
  ,re_pcom: /\(([^)]*)\)/  // comments in parens
  ,re_scom: /;(.*)$/        // comments ; semicolon to end of line
}
/* According to Wikipedia (http://en.wikipedia.org/wiki/G-code) (mostly) */
var G = { 
   0:   "Rapid positioning"                                                        //  M   T  
  ,1:   "Linear interpolation"                                                     //  M  T 
  ,2:   "Circular interpolation, clockwise"                                        //  M || T 
  ,3:   "Circular interpolation, counterclockwise"                                 //  M || T
  ,4:   "Dwell"                                                                    //  M || T
  ,5:   "High-precision contour control (HPCC)"                                    //  M 
  ,5.1: "AI Nano contour control"                                                  //  M
  ,6.1: "Non Uniform Rational B Spline Machining"                                  //  M 
  ,7:   "Imaginary axis designation"                                               //  M
  ,9:   "Exact stop check"                                                         //  M || T
  ,10:  "Programmable data input"                                                  //  M || T 
  ,11:  "Data write cancel"                                                        //  M || T 
  ,12:  "Full-circle interpolation, clockwise"                                     //  M 
  ,13:  "Full-circle interpolation, counterclockwise"                              //  M 
  ,17:  "XY plane selection"                                                       //  M 
  ,18:  "ZX plane selection"                                                       //  M || T 
  ,19:  "YZ plane selection"                                                       //  M 
  ,20:  "Programming in inches"                                                    //  M || T 
  ,21:  "Programming in millimeters (mm)"                                          //  M || T 
  ,28:  "Return to home position (machine zero, aka machine reference point)"      //  M || T 
  ,30:  "Return to secondary home position (machine zero, aka machine reference point)" // || M || T 
  ,31:  "Skip function (used for probes and tool length measurement systems)"      //  M 
  ,32:  "Single-point threading, longhand style"                                   //  T 
  ,40:  "Tool radius compensation off"                                             //  M || T 
  ,41:  "Tool radius compensation left"                                            //  M || T 
  ,42:  "Tool radius compensation right"                                           // M || T 
  ,43:  "Tool height offset compensation negative"                                 // M 
  ,44:  "Tool height offset compensation positive"                                 // M 
  ,45:  "Axis offset single increase"                                              // M 
  ,46:  "Axis offset single decrease"                                              // M 
  ,47:  "Axis offset double increase"                                              // M
  ,48:  "Axis offset double decrease"                                              // M
  ,49:  "Tool length offset compensation cancel"                                   // M 
  //,50: "Define the maximum spindle speed" //  T 
  ,50: "Scaling function cancel"                                                   // M
//50 || Position register (programming of vector from part zero to tool tip) || &nbsp; || T || Position register is one of the original methods to relate the part (program) coordinate system to the tool position, which indirectly relates it to the machine coordinate system, the only position the control really "knows". Not commonly programmed anymore because [[#G54 to G59|G54 to G59]] (WCSs) are a better, newer method. Called via G50 for turning, [[#G92|G92]] for milling. Those G addresses also have alternate meanings (which see). Position register can still be useful for datum shift programming.
  ,52: "Local coordinate system (LCS)"                                             // M
  ,53: "Machine coordinate system"                                                 // M || T
  ,54: "Work coordinate systems (WCSs)"                                            // M || T 
  ,54.1: "Extended work coordinate systems"                                        // M T // P1 to P48?
  ,55: "Work coordinate systems (WCSs)"                                            // M || T 
  ,56: "Work coordinate systems (WCSs)"                                            // M || T 
  ,57: "Work coordinate systems (WCSs)"                                            // M || T 
  ,58: "Work coordinate systems (WCSs)"                                            // M || T 
  ,59: "Work coordinate systems (WCSs)"                                            // M || T 
  // http://www.tormach.com/g61_g64.html
  ,61: "Set Path Control Mode"
  ,62: "Set Path Control Mode"
  ,63: "Set Path Control Mode"
  ,64: "Set Path Control Mode"
  ,70: "Fixed cycle, multiple repetitive cycle, for finishing (including contours)"    // T
  ,71: "Fixed cycle, multiple repetitive cycle, for roughing (Z-axis emphasis)"        // T 
  ,72: "Fixed cycle, multiple repetitive cycle, for roughing (X-axis emphasis)"        // T
  ,73: "Fixed cycle, multiple repetitive cycle, for roughing, with pattern repetition" // T
  ,73: "Peck drilling cycle for milling - high-speed (NO full retraction from pecks)"  // M 
//  ,74: "Peck drilling cycle for turning"                                             //  T ;
  ,74: "Tapping cycle for milling, lefthand thread"                                    // M
  ,75: "Peck grooving cycle for turning"                                               //  T 
  ,76: "Fine boring cycle for milling"                                                 // M 
//76 || Threading cycle for turning, multiple repetitive cycle || &nbsp; || T || &nbsp;
  ,80: "Cancel canned cycle"                                                           // M || T 
  ,81: "Simple drilling cycle"                                                         // M 
  ,82: "Drilling cycle with dwell"                                                     // M 
  ,83: "Peck drilling cycle (full retraction from pecks)"                              // M 
  ,84: "Tapping cycle, righthand thread"                                               // M
  ,84.2: "Tapping cycle, righthand thread, rigid toolholder"                           // M 
  ,90: "Absolute programming"                                                          // M || T (B) 
//90 || Fixed cycle, simple cycle, for roughing (Z-axis emphasis) || &nbsp; || T (A) || When not serving for absolute programming (above)
  ,91: "Incremental programming"                                                       // M || T (B) 
  ,92: "Position register (programming of vector from part zero to tool tip)"          // M || T (B) 
//92 || Threading cycle, simple cycle || &nbsp; || T (A) || &nbsp;
  ,94: "Feedrate per minute"                                                           // M || T (B) 
//94 || Fixed cycle, simple cycle, for roughing ([[#X|X]]-axis emphasis) || &nbsp; || T (A) || When not serving for feedrate per minute (above)
  ,95: "Feedrate per revolution"                                                       // M || T (B) || On group type A lathes, feedrate per revolution is [[#G99|G99]].
  ,96: "Constant surface speed (CSS)"                                                  // T 
  ,97: "Constant spindle speed"                                                        // M || T 
  ,98: "Return to initial Z level in canned cycle"                                     // M 
//98 || Feedrate per minute (group type A) || &nbsp; || T (A) || Feedrate per minute is [[#G94|G94]] on group type B.
  ,99: "Return to R level in canned cycle"                                             // M 
//99 || Feedrate per revolution (group type A) || &nbsp; || T (A) || Feedrate per revolution is [[#G95|G95]] on group type B.
}

var M = {
   00: "Compulsory stop"                                        // M || T 
  ,01: "Optional stop"                                          // M || T 
  ,02: "End of program"                                         // M || T 
  ,03: "Spindle on (clockwise rotation)"                        // M || T 
  ,04: "Spindle on (counterclockwise rotation)"                 // M || T 
  ,05: "Spindle stop"                                           // M || T 
  ,06: "Automatic tool change (ATC)"                            // M || T (some-times) 
  ,07: "Coolant on (mist)"                                      // M || T 
  ,08: "Coolant on (flood)"                                     // M || T
  ,09: "Coolant off"                                            // M || T 
  ,10: "Pallet clamp on"                                        // M 
  ,11: "Pallet clamp off"                                       // M 
  ,13: "Spindle on (clockwise rotation) and coolant on (flood)" // M 
  ,19: "Spindle orientation"                                    // M || T 
  ,21: "Mirror, X-axis"                                         // M 
//  ,21: "Tailstock forward"//  T 
  ,22: "Mirror, Y-axis"                                         // M
//  ,22: "Tailstock backward" // T
  ,23: "Mirror OFF"                                             // M 
//  ,23: "Thread gradual pullout ON" //  T
  ,24: "Thread gradual pullout OFF"                             // T 
  ,30: "End of program with return to program top"              // M || T
  ,41: "Gear select - gear 1"                                   // T
  ,42: "Gear select - gear 2"                                   // T
  ,43: "Gear select - gear 3"                                   // T
  ,44: "Gear select - gear 4"                                   // T
  ,48: "Feedrate override allowed"                              // M || T
  ,49: "Feedrate override NOT allowed"                          // M || T
  ,52: "Unload Last tool from spindle"                          // M || T
  ,60: "Automatic pallet change (APC)"                          // M 
  ,98: "Subprogram call"                                        // M || T 
  ,99: "Subprogram end"                                         // M || T 
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
    var comments = []
    var m = line.match(CONST.re_scom)
    if (m) {
      comments.push(m[1])
      line = line.replace(CONST.re_scom, '')
    }
    while ( m = line.match(CONST.re_pcom)) {
      comments.push(m[1])
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


var CB = function (cb) {
  this.cb = cb
  var self = this
  
  this.callback = function(code) {
    switch (code.ev) {
      case EVENTS.ERROR      :
      case EVENTS.COMMENT    :
      case EVENTS.BLOCK_START:
      case EVENTS.BLOCK_END  :
        break
      case EVENTS.WORD       :
        enrichWord(code)
        break
      default:
        console.log(code)
        console.log("wtf? dying")
        process.exit()
    }
    self.cb(code)
  }

  function enrichWord(code) {
    switch(code.code) {
    case "A":
      code.desc = "Absolute or incremental position of A axis (rotational axis around X axis)"
      break
    case "B":
      code.desc = "Absolute or incremental position of B axis (rotational axis around Y axis)"
      break
    case "C":
      code.desc = "Absolute or incremental position of C axis (rotational axis around Z axis)"
      break
    case "D":
      code.desc = "Defines diameter or radial offset used for cutter compensation."
      break
    case "E":
      code.desc = "Precision feedrate for threading on lathes"
      break
    case "F":
      code.desc = "Defines feed rate"
      break
    case "G":
      code.desc = G[code.value]
      break
    case "H":
      code.desc = "Defines tool length offset"
      break
    case "I":
      code.desc = "Defines arc center in X axis for G02 or G03 arc commands."
      break
    case "J":
      code.desc = "Defines arc center in Y axis for G02 or G03 arc commands."
      break
    case "K":
      code.desc = "Defines arc center in Z axis for G02 or G03 arc commands."
      break
    case "L":
      code.desc = "Fixed cycle loop count"
      break
    case "M":
      code.desc = M[code.value]
      break
    case "N":
      code.desc = "Block number"
      break
    case "O":
      code.desc = "Program name"
      break
    case "P":
      code.desc = "Serves as parameter address for various G and M codes"
      break
    case "Q":
      code.desc = "Peck increment in canned cycles"
      break
    case "R":
      code.desc = "Defines size of arc radius or defines retract height in milling canned cycles"
      break
    case "S":
      code.desc = "Defines speed, either spindle speed or surface speed depending on mode"
      break
    case "T":
      code.desc = "Tool selection"
      break
    case "U":
      code.desc = "Incremental axis corresponding to X axis "
      break
    case "V":
      code.desc = "Incremental axis corresponding to Y axis"
      break
    case "W":
      code.desc = "Incremental axis corresponding to Z axis "
      break
    case "X":
      code.desc = "Absolute or incremental position of X axis."
      break
    case "Y":
      code.desc = "Absolute or incremental position of Y axis"
      break
    case "Z":
      code.desc = "Absolute or incremental position of Z axis"
      break
    }
  }
  
}


//console.log(process.argv.pop())
var fn = process.argv.pop()
var fs = require("fs")
var data = fs.readFileSync(fn)


function check (code) {
  if (code.ev == EVENTS.BLOCK_START) {
    p(code.line)
  } else if (code.ev == EVENTS.WORD) {
    if (code.code === "N") {
    } else {
      p("  not supported: "+code.code+""+code.value+"("+code.desc+")")
    }
  }
}

var cb = new CB(check)

var parser = new GCode(cb.callback)
parser.parse(data)

exports.GCode = GCode


