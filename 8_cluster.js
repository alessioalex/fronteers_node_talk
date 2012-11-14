// So if Node is single threaded, what are we to do?
// Easy, we can spawn multiple processes that share the same file descriptor

var cluster = require('cluster');
var http    = require('http');
var numberOfWorkers = 10;

if (cluster.isMaster) {

  // Keep track of http requests
  var numReqs = 0;
  setInterval(function() {
    console.log("numReqs =", numReqs);
  }, 1000);

  // Count requestes
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd == 'notifyRequest') {
      numReqs += 1;
    }
  }

  // Start workers and listen for messages containing notifyRequest
  for (var i = 0; i < numberOfWorkers; i++) {
    cluster.fork();
  }

  Object.keys(cluster.workers).forEach(function(id) {
    cluster.workers[id].on('message', messageHandler);
  });

} else {

  // Worker processes have a http server.
  http.Server(function(req, res) {
    res.writeHead(200);
    res.end("hello world\n");

    console.log('Worker ' + cluster.worker.id + ' got req');

    // notify master about the request
    process.send({ cmd: 'notifyRequest' });
  }).listen(8000);
};

// What else can you do with this?
// Practical example: if the number of connections in the last minute > N
// you can spawn more workers dynamically. In the same way if nrConn < N you can
// kill some workers
