

var  test_dirs = ["test/cuttingedge", "test/tormach"]
    ,json_dir  = "test/json"
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

// test to make sure that all test gcode parses without errors
function test(fn) {
  if (fn.match(/\.(cnc|tap)$/)) {
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


// deep compare utility for json fixture tests, see below

function compare(fn, should, is) {
  if (should.length !== is.length) {
    error("unequal lengths: "+fn+" should:"+should.length+" is:"+is.length)
  }

  for (var i = 0; i!=should.length; ++i) {
    var  shld = should[i]
        ,iz   = is[i]

    for (var p in shld) {
      if (shld[p] !== iz[p]) {
        error("values unequal in event: "+i+" should:"+JSON.stringify(shld)+" is: "+JSON.stringify(iz))
      }
    }
  }
}

// test to compare the stream of emitted events to a dry run of pre
// parsed events.
function test_json(fn) {
  
  if (fn.match(/\.(cnc|tap)$/)) {

    var fnjson = json_dir + "/" + fn.replace(/^test\//, '')+".json"
    var json = JSON.parse(fs.readFileSync(fnjson))
  
    fs.readFile(fn, function(err, data) {
      if (err) {
        error(err)
      }
      var arr = []
      function collect(ev) {
        arr.push(ev)
      }
      var gcp = new gcode.GCode(collect)
      if (!gcp.parse(data)) {
        error("error parsing: "+fn)
      }
      compare(fn, json, arr)
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
    files.forEach(test_json)
  })
})
