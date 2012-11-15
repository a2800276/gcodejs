

var test_dirs = ["test/cuttingedge", "test/tormach"]
var fs        = require("fs"),
    gcode     = require("./parser.js")
var p         = console.log

function error(msg) {
  p(msg)
  process.exit()
}

function perr(data){
  if (data.ev === gcode.Events.ERROR) {
    p(data)
  }
}

function test(fn) {
  if (fn.match(/\.(cnc|tap)$/)) {
  p(fn) 
    fs.readFile(fn, function(err, data) {
      if (err) {
        error(err)
      }
      var gcp = new gcode.GCode(perr)
      if (!gcp.parse(data)) {
        error("error parsing: "+fn)
      }
    })
  }
}

test_dirs.forEach(function(dir){
  fs.readdir(dir, function(err,files) {
    if (err) {
      error(err)
    }
    files = files.map(function(f) {return dir+"/"+f})
    files.forEach(test)
  })
})
