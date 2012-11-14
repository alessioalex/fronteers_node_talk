/*

Node.js is a platform built on Chrome's JavaScript runtime for easily building fast,
scalable network applications.
Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient,
perfect for data-intensive real-time applications that run across distributed devices.

http://nodejs.org/api/

*/

var http = require('http'),
    port = process.env.PORT || 1337;

function getMemoryUsage() {
  var memUsg, html;

  html   = '<ul>';
  memUsg = process.memoryUsage();

  Object.keys(memUsg).forEach(function(key) {
    html += '<li>' + key + ': ' + memUsg[key]  + '</li>';
  });

  html += '</ul>';

  return html;
}

// simple http server that outputs the memory usage of the current process
http.createServer(function (req, res) {
  if (req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<h1>Memory usage</h1>');
    res.end(getMemoryUsage());
  } else {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end('<h1>Page Not Found!</h1>');
  }
}).listen(port, function() {
  console.log('Server running on port ' + port);
});
