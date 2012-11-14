/*
When things get messy, you don't have to write spaghetti code. Either organize
your code with functions, a "class" or use control flow libraries like:

- step: https://github.com/creationix/step
- async: https://github.com/caolan/async [ more complex async stuff ]

*/

// simulate a database call that takes 2-5 seconds to process
function fakeDbCall(query, callback) {
  var timer = Math.floor(Math.random() * 4) + 2;

  // callback(error, data) - Node.js best practice
  callback(null, Date.now());
}


// Christmas Tree
var http = require('http');
http.createServer(function (req, res) {
  var results = [];

  fakeDbCall("give me some user data", function(err, data) {
    if (err) { throw err; }
    results.push(data);
    fakeDbCall("give me all stats for the user data", function(err, data) {
      if (err) { throw err; }
      results.push(data);
      fakeDbCall("another unrelated database query", function(err, data) {
        if (err) { throw err; }
        results.push(data);
        fakeDbCall("N-th query", function(err, data) {
          if (err) { throw err; }
          results.push(data);
          fakeDbCall("You get the picture!", function(err, data) {
            if (err) { throw err; }
            results.push(data);

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(JSON.stringify(results));

          });
        });
      });
    });
  });
}).listen(1337, '127.0.0.1');

// With Step
var Step = require('step');
http.createServer(function (req, res) {
  var results = [];

  Step(
    function firstQuery() {
      fakeDbCall("give me some user data", this);
    },
    function secondQuery(err, data) {
      if (err) { throw err; }

      results.push(data);
      fakeDbCall("give me all stats for the user data", this);
    },
    function thirdQuery(err, data) {
      if (err) { throw err; }

      results.push(data);
      fakeDbCall("another unrelated database query", this);
    },
    function fourthQuery(err, data) {
      if (err) { throw err; }

      results.push(data);
      fakeDbCall("N-th query", this);
    },
    function nthQuery(err, data) {
      if (err) { throw err; }

      results.push(data);
      fakeDbCall("You get the picture!", this);
    },
    function deliverResponse(err, data) {
      if (err) { throw err; }

      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(JSON.stringify(results));
    }
  );

}).listen(1337, '127.0.0.1');
