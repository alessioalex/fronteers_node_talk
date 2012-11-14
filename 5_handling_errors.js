// Bad

//*
function myAsyncAction() {
  setTimeout(function() {
    throw new Error("Since Node is async, it can throw an error after X seconds");
  }, 1500);
}

try {
  myAsyncAction();
}
catch(err) {
  console.log('an error occured', err);
}
//*/

// Good

/*
function myAsyncAction(callback) {
  setTimeout(function() {
    callback(new Error("First param of callback is error"));
  }, 1500);
}

myAsyncAction(function(err, data) {
  if (err) {
    console.log('I have decide not to throw the error', err);
  }
});
//*/

// Handling global uncaught error

/*
process.on('uncaughtException', function(err) {
  // This keeps the process from crashing, but you have no idea where the
  // error came from
});
//*/

// Domains to the resque, Node >= 0.8.x

/*
var domain       = require('domain'),
    serverDomain = domain.create(),
    otherDomain  = domain.create(),
    http         = require('http');

serverDomain.run(function() {
  http.createServer(function (req, res) {
    throw new Error('error 8237462374');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
  }).listen(1337, '127.0.0.1');
});

serverDomain.on('error', function(err) {
  console.log('Precious intel, we know that the error came from the serverDomain', err);
});

otherDomain.run(function() {
  setInterval(function() {
    throw new Error('Tuesday 13!!!');
  }, 3000);
});

otherDomain.on('error', function(err) {
  console.log('Error coming from the other domain', err);
});
//*/

