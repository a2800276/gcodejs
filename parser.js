

// These are the names of the "events" the state machine will emit
var EVENTS = {
   BLOCK_START : "BLOCK_START"
  ,BLOCK_END   : "BLOCK_END"
  ,BLOCK_DEL   : "BLOCK_DEL"
  ,WORD        : "WORD"
  ,COMMENT     : "COMMENT"
  ,ERROR       : "ERROR"
}

var ABC = {
   A : "A".charCodeAt(0)
  ,B : "B".charCodeAt(0)
  ,C : "C".charCodeAt(0)
  ,D : "D".charCodeAt(0)
  ,E : "E".charCodeAt(0)
  ,F : "F".charCodeAt(0)
  ,G : "G".charCodeAt(0)
  ,H : "H".charCodeAt(0)
  ,I : "I".charCodeAt(0)
  ,J : "J".charCodeAt(0)
  ,K : "K".charCodeAt(0)
  ,L : "L".charCodeAt(0)
  ,M : "M".charCodeAt(0)
  ,N : "N".charCodeAt(0)
  ,O : "O".charCodeAt(0)
  ,P : "P".charCodeAt(0)
  ,Q : "Q".charCodeAt(0)
  ,R : "R".charCodeAt(0)
  ,S : "S".charCodeAt(0)
  ,T : "T".charCodeAt(0)
  ,U : "U".charCodeAt(0)
  ,V : "V".charCodeAt(0)
  ,W : "W".charCodeAt(0)
  ,X : "X".charCodeAt(0)
  ,Y : "Y".charCodeAt(0)
  ,Z : "Z".charCodeAt(0)
  ,ZERO: "0".charCodeAt(0)
  ,NINE: "9".charCodeAt(0)
  ,DOT: ".".charCodeAt(0)
  ,MINUS: "-".charCodeAt(0)
  ,CR: "\r".charCodeAt(0)
  ,LF: "\n".charCodeAt(0)
  ,SPACE: " ".charCodeAt(0)
  ,SLASH: "/".charCodeAt(0)
  ,OPARENS: "(".charCodeAt(0)
  ,CPARENS: ")".charCodeAt(0)
  ,SEMI: ";".charCodeAt(0)
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

var STATE = {
   START         :0
  ,WORD          :1
  ,PCOMMENT      :2 // parentheszed comments can't be nested
  ,SCOMMENT      :3 // comments delimited with ';' extend to the end of the line
  ,LF            :4 // expecting a '\n'
  ,VALUE_START   :5 // value may start with a '-'
  ,VALUE         :6
  ,VALUE_POST_DOT:7 // but can have only one decimal point.
}

/**
 *   Initialize GCode Statemachine to analyze scripts. 
 *
 *   currently doens't handle params ...
 *
 *   cb: callback function called while parsing the script. 
 *
 *       callback are always passed a hash containing the following:
 *       {
 *          ev: (one of EVENTS.ERROR, .BLOCK_START, .BLOCK_END, BLOCK_DEL
 *               .WORD or .COMMENT)
 *          line_no: the line currently being processed.
 *       }
 *    
 *   Depending on the type of event, further data is passed to the callback 
 *   in the hash:
 *   
 *   BLOCK_START: called at the beginning of each line, no further data
 *   BLOCK_END  : called at the end of each line(no further data),
 *                indicating the block should be ordered and processed.
 *   BLOCK_DELETE: called on a leading '/'
 *   ERROR      : called on unexpected input, in case 'continue_on_error'
 *                (see: cfg, below) is set to true, the statemachine will 
 *                try to  continue.
 *
 *   includes the following additional fields:
 *      msg: the error message
 *      state: the STATE (see above) the state machine is currently in.
 *
 *   WORD       : called after recognizing a G-Code word, e.g. G00, X12,
 *                etc. includes the following additional fields:
 *      code : the letter of the command, e.g. X12 -> "X"
 *      value: the value of the command, e.g. X12 -> 12
 *      desc : a human readable interpretation of the command, e.g. 
 *             G0 -> "rapid positioning" this is not added if the
 *             no_annotate parameter in `cfg` (see below) is false.
 *    
 *   COMMENT   : a comment, includes:
 *      comment: the text of the comment
 *   
 *
 *   cfg: hash containing configuration
 *     default values:
 *
 *     {continue_on_error : false
 *      no_annotate       : false}
 *      
 *      continue_on_error: whether the `parse` function should
 *                     return false immediately after encountering
 *                     an error. A callback with an ERROR event is
 *                     still emitted
 *
 *      no_annotate: whether to add a 'desc' field to emitted WORD 
 *                events.
 *      
 */
var GCode = function (cb, cfg) {
  var self = this
  var cfg  = cfg || {}

  var cb = cfg.no_annotate ? cb : new CB(cb).callback
  
  // the line currently being processed (startes at 0, events emitted
  // correct this)
  var line_no=0
  // current state of the machine
  var state = STATE.START
  // used to collect a comment being parsed
  var comment = ""
  // used to remember the letter of the command until it can be emitted
  // along with it's value
  var cmd = ""
  // used to collect the value of a command.
  var value = ""

  // utility to emit errors
  function error(msg) {
    cb({
       ev      : EVENTS.ERROR
      ,line_no : line_no+1
      ,msg     : msg
      ,state   : state
    }) 
  }
  // utility to emit comment events
  function cb_comment () {
    cb({
       ev: EVENTS.COMMENT
      ,line_no: line_no+1
      ,comment: comment
    })
    // reset collector var
    comment = ""
  }

  // utility to emit word events.
  function word() {
    cb({
       ev:   EVENTS.WORD
      ,code: cmd
      ,value: parseFloat(value)
      ,line_no: line_no+1
    }) 
    // reset collector vars
    cmd   = ""
    value = ""
  }

  // Pass in current chunks of data to parse, may be either String
  // or Buffer (if available). Unless GCode was configured with
  // `continue_on_error` (see above) it returns true if all the data
  // could be parsed and falls immediately after emitting an ERROR. In
  // case `continue_on_error` is set, it will try to continue after
  // encountering an error. (This will void your warranty)
  this.parse = function parse(data) {

    function isUpcaseAtoZ(letter) {
      if (ABC.A <= letter && letter <= ABC.Z) {
        return true
      }
      return false
    }

    function isDigit(letter) {
      if (ABC.ZERO <= letter && letter <= ABC.NINE) {
        return true
      }
      return false
    }

    function isSpace(letter) {
      if (letter === ABC.SPACE || letter === ABC.TAB) {
        return true;
      }
      return false
    }

    function check(should, is) {
      if (!should === is) {
        error("unexpected: "+is+" expected:"+should)
        return false
      }
      return true
    }
    
    var using_buffer = false
    if (has_buffer && typeof(data) === "string") {
      data = new Buffer(data)
      using_buffer = true
    } else if (has_buffer) {
      using_buffer = Buffer.isBuffer(data)
    }  

    for (var i =0; i!=data.length; ++i) {
      var b = using_buffer ? data[i] : data.charCodeAt(i)
          //,b_ = data[i]
      switch(state) {
        case STATE.START:
          cb({ev:     EVENTS.BLOCK_START,
              line_no:line_no + 1})
          switch(true) {
            case isSpace(b):
              break;
            case b === ABC.SLASH:
              cb({
                ev: EVENTS.BLOCK_DEL,
                line_no: line_no+1
              })
              state = STATE.WORD
              break
            case b === ABC.OPARENS:
              state = STATE.PCOMMENT
              break
            case b === ABC.SEMI:
              state = STATE.SCOMMENT
              break
            case b === ABC.CR:
              state = STATE.LF
              break
            case b === ABC.LF:
              state = STATE.LF
              i--
              continue
            case isUpcaseAtoZ(b):
              state = STATE.WORD
              i--
              continue
            default:
               error("unexpected: "+String.fromCharCode(b))
               if (!cfg.continue_on_error) {
                return false
               }
          }
          break // STATE.START

        case STATE.WORD:
          switch (true) {
            case isSpace(b): // ignore
              break
            case isUpcaseAtoZ(b):
              cmd = String.fromCharCode(b)
              state = STATE.VALUE_START
              break
            case b === ABC.OPARENS:
              state = STATE.PCOMMENT
              break
            case b === ABC.SEMI:
              state = STATE.SCOMMENT
              break
            case b === ABC.CR:
              state = STATE.LF
              break
            case b === ABC.LF:
              state = STATE.LF
              i--
              continue
            default:
              error("unexpected: "+String.fromCharCode(b))
              if (!cfg.continue_on_error) {
                return false
              }
          }
          break // STATE.WORD

        case STATE.PCOMMENT:
          switch(b) {
            case ABC.OPARENS:
              error("nested comment")
              if (!cfg.continue_on_error) {
                return false
              }
              break
            case ABC.CPARENS: // closing parens
              cb_comment()
              state = STATE.WORD
              break
            default:
              comment += String.fromCharCode(b)
          }
          break // STATE.PCOMMENT

        case STATE.SCOMMENT:
          // semicolon comments extend to end of line...
          switch(b) {
            case ABC.CR:
              cb_comment()
              state = STATE.LF
              break
            case ABC.LF:
              cb_comment()
              state = STATE.LF
              i--
              continue
            default:
              comment+=String.fromCharCode(b)

          }
          break // STATE.SCOMMENT

        case STATE.LF:
          if (!check(ABC.LF, b)){
            if(!cfg.continue_on_error) {
              return false
            }
            // if we're not halting on err, there was
            // only a \r, so some sort of newline, rewind and
            // goto STATE.START
            --i
          }
          cb({
            ev: EVENTS.BLOCK_END,
            line_no: line_no+1
          })
          line_no++
          state = STATE.START
          break // STATE.LF

        case STATE.VALUE_START:
          switch(true) {
            case isSpace(b):
              break
            case b === ABC.MINUS:
            case isDigit(b):
              value += String.fromCharCode(b)
              state = STATE.VALUE
              break
            case b === ABC.DOT:
              value += String.fromCharCode(b)
              state = STATE.VALUE_POST_DOT
              break
            default:
              error("not a valid value: "+String.fromCharCode(b))
              if (!cfg.continue_on_error) {
                return false
              }
          }
          break // STATE.VALUE_START

        case STATE.VALUE:
          switch(true) {
            case isSpace(b):
              break
            // actual values ...
            case isDigit(b):
              value += String.fromCharCode(b)
              state = STATE.VALUE
              break
            case b === ABC.DOT:
              value += String.fromCharCode(b)
              state = STATE.VALUE_POST_DOT
              break
            // line ends ...
            case b === ABC.CR:
              word()
              state = STATE.LF
              break
            case b === ABC.LF:
              word()
              state = STATE.LF
              i--
              continue
            // new word starts ...
            case isUpcaseAtoZ(b):
              word()
              state = STATE.WORD
              i--
              continue
            // comment starts ...
            case b === ABC.OPARENS:
              word()
              state = STATE.PCOMMENT
              break
            case b === ABC.SEMI:
              word()
              state = STATE.SCOMMENT
              break
            default:
              error("not a valid value: "+String.fromCharCode(b))
              if (!cfg.continue_on_error) {
                return false
              }
          }
          break // STATE.VALUE

        case STATE.VALUE_POST_DOT:
          switch(true) {
            case isSpace(b):
              break
            // after a decimal point has been encountered in a 
            // value, only digits are legal.
            case isDigit(b):
              value += String.fromCharCode(b)
              state = STATE.VALUE
              break
            case b === ABC.CR:
              word()
              state = STATE.LF
              break
            case b === ABC.LF:
              word()
              state = STATE.LF
              i--
              continue
            case isUpcaseAtoZ(b):
              word()
              state = STATE.WORD
              i--
              continue
           case b === ABC.OPARENS:
              word()
              state = STATE.PCOMMENT
              break
            case b === ABC.SEMI:
              word()
              state = STATE.SCOMMENT
              break
            default:
              error("not a valid value: "+String.fromCharCode(b))
              if (!cfg.continue_on_error) {
                return false
              }
          }
          break
        default:
          error("invalid state:"+state)
          if (!cfg.continue_on_error) {
            return false
          }
      } // switch state

    } // for
    return true
  } // parse
}

      
     

var p = console.log

// this is a decorator (or whatever) used to add a human readable
// describtion to word events being emitted. It's use is controlled
// by the no_annotate parameter in `cfg` when instantiating the parser.
var CB = function (cb) {
  this.cb = cb
  var self = this
  
  this.callback = function(code) {
    switch (code.ev) {
      case EVENTS.ERROR      :
      case EVENTS.COMMENT    :
      case EVENTS.BLOCK_START:
      case EVENTS.BLOCK_END  :
      case EVENTS.BLOCK_DEL  :
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

var has_buffer
(function check_has_buffer() {
  // check whether we are being executed from within, let's say, node.
  try {
    new Buffer("")
    has_buffer = true
  } catch(e) {
    has_buffer = false
  }
})()





exports.GCode  = GCode
exports.Events = EVENTS


