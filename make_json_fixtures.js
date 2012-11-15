
// this is a utility used to create 'valid' test results.
// it parses each of the fixtures under `test` and serializes the stream of
// emitted events into `test/json`

var test_dirs = ["test/cuttingedge", "test/tormach"]
    json_dir  = "test/json"
var fs        = require("fs"),
    gcode     = require("./parser.js")
var p         = console.log

function error(msg) {
  p(msg)
  process.exit()
}

function log(data, arr){
  arr.push(data)
}

function test(fn) {
  if (fn.match(/\.(cnc|tap)$/)) {
  p(fn) 
    fs.readFile(fn, function(err, data) {
      if (err) {
        error(err)
      }
      var arr = []
      var cb = function(ev) {
        log(ev,arr)
      }
      var gcp = new gcode.GCode(cb)
      if (!gcp.parse(data)) {
        error("error parsing: "+fn)
      }
      fn = fn.replace(/^test/,'')
      fs.writeFile(json_dir+"/"+fn+".json", JSON.stringify(arr), function(err){
        error(err)
      })
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
