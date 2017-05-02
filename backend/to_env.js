#!/usr/bin/env node
var strings = [];
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(data) {
  var json = JSON.parse(data);
  for (var key in json) {
    var val = json[key];
    strings.push(key + '="' + val + '"');
  }
});
process.stdin.on('end', function() {
  var output = strings.join('\n');
  process.stdout.write(output);
});
