const parse = require('csv-parse')
const fs = require('fs')

function main () {
  var args = process.argv

  if (args.length < 4) {
    console.log(`usage: ${args[0]} ${args[1]} <input> <output>`)
    return
  }

  args.splice(0, 2)
  console.log(args)

  function makeKeys (arr) {
    var keys = []
    arr.forEach(k => {
      keys.push(k.toUpperCase())
    })
    return keys
  }

  var parser = parse({ trim: true, skip_empty_lines: true }, function (err, r) {
    if (err) throw err

    var keys = makeKeys(r.splice(0, 1)[0])
    var spaces = []
    var buffer = ''
    for (var i = 0; i < keys.length; i++) {
      var maxLen = keys[i].length + 1
      r.forEach(v => {
        v[i] = v[i].replace('\n', '\\n')
        if (v[i].length > maxLen - 1) {
          maxLen = v[i].length + 1
        }
      })
      spaces.push(maxLen)
    }

    for (var k = 0; k < keys.length; k++) {
      var s = spaces[k] - keys[k].length
      buffer += keys[k].replace(' ', '_') + ' '.repeat(s > 0 ? s : 0)
    }
    buffer += 'END \n'

    for (var v = 0; v < r.length; v++) {
      for (var j = 0; j < r[v].length; j++) {
        var sp = spaces[j] - r[v][j].length
        buffer += r[v][j] + ' '.repeat(sp > 0 ? sp : 0)
      }
      buffer += '\n'
    }

    fs.writeFile(args[1], buffer, function (err) {
      if (err) throw err
    })
  })

  fs.readFile(args[0], function (err, data) {
    if (err) throw err
    parser.write(data)
    parser.end()
  })
}

main()
