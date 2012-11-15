var GCode  = require("./parser.js").GCode,
    EVENTS = require("./parser.js").Events,
    Turtle = require("../hidnode/script.js").Turtle


var MODES = {
  RAPID_POSITIONING : "RAPID_POSITIONING"
}

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

var Driver = function () {
  var self = this
  var turtle = new Turtle()
  
  var line_no, block_no
  
  this.pos = {x:0,y:0,z:0}
  this.conversion = 1 // millimeters
  this.mode
  this.speed = 0


  this.callback = function (code) {
    switch(code.ev) {
      case EVENTS.BLOCK_START:
        line_no = code.line_no
        break
      case EVENTS.BLOCK_END:
        // should collect all intermittant events, reorder them and execute them ...
        break
      case EVENTS.COMMENT:
    //    p(code.comment)
        break
      case EVENTS.WORD:
      p(code)
        switch(code.code) {
          case "N":
            block_no = code.value
            break
          case "G":
            handleG(code)
            break
          case "M":
            handleM(code)
            break
          case "X":
          case "Y":
          case "Z":
            handlePos(code)
            break
          default:
            p("---")
            p("  not supported: "+code.code+" "+code.value+"("+code.desc+")")
            p("---")
        }
        break
      default:
        p("  not supported: ")
        p(code)
    }
  }

  function handleG(code) {
    switch(code.value) {
      case 0:
        self.mode = MODES.RAPID_POSITIONING
        break
      case 4:
        self.mode = MODES.DWELL
      case 21:
        self.conversion = 1
        break
      case 20:
        self.conversion = 1/25.4
        break
      default:
        p("  not supported:"+code.code+" "+code.value+" "+code.desc)
        p(code)
    }
  }

  function handleM(code) {
    switch(code.value) {
      case 3:
        turtle.spindle(0.5)
        break
      default:
        p("  not supported:"+code.code+" "+code.value+" "+code.desc)
        p(code)
    }
  }

  function handlePos(code) {
    switch(code.code) {
      case "X":
        self.pos.x = code.value * self.conversion
        break
      case "Y":
        self.pos.y = code.value * self.conversion
        break
      case "Z":
        self.pos.z = code.value * self.conversion
        break
      default:
        throw "tantrum"
    }

    if (self.mode === MODES.RAPID_POSITIONING) {
      turtle.speed(1.0)
    }
//    console.log(self.pos)
    turtle.move(self.pos)
    if (self.mode === MODES.RAPID_POSITIONING) {
      turtle.speed(self.speed)
    }

  }


}


var fn = process.argv.pop()
var fs = require("fs")
var data = fs.readFileSync(fn)
var p = console.log

var driver = new Driver()

var parser = new GCode(driver.callback)
console.log(data)
parser.parse(data)
