// This example has been modified after https://gist.github.com/707146

var net  = require('net'),
    port = process.argv[2] || 5000,
    admins, clients;

// all the users that can connect to our chat, format -> username:password
accounts = ['alex:alex', 'john:john'];

// Keep track of the chat clients
clientSockets = [];

// helper functions {
// Send a message to all clients
function broadcast(message, sender) {
  clientSockets.forEach(function (client) {
    // Don't want to send it to sender
    if (client === sender) return;
    client.write(message);
  });
  // Log it to the server output too
  process.stdout.write(message);
}

// login user by checking his info with the available accounts
function login(data) {
  var index;

  // "clean up" data
  data  = data.trim().toLowerCase();
  // find user:pass combination
  index = accounts.indexOf(data);

  // if login successful, return user
  return (index > -1) ? (accounts[index].split(':')[0]) : false;
}

// check if user is authentified, by looking at the socket.name
function isAuth(socket) {
  return !!socket.name;
}

function disconnect(socket) {
  socket.emit('end');
  socket.destroy();
}
// }

// Start a TCP Server
net.createServer(function(socket) {

  socket.setEncoding('utf8');

  // Ask the user to login right after connecting
  socket.write("Hello there, please login by entering username:password\n");

  // Handle incoming messages from clients
  socket.on('data', function(data) {
    var user;

    if (isAuth(socket)) {
      if (data.trim() === 'exit') {
        disconnect(socket);
      } else {
        broadcast(socket.name + "> " + data, socket);
      }
    } else {
      user = login(data);
      if (!user) {
        socket.write("Bad user/pass combination, try again!\n");
      } else {
        // Identify & welcome this client
        socket.name = user + '@' + socket.remoteAddress + ":" + socket.remotePort;
        socket.write("You are now logged in " + socket.name + "\n");

        // Put this new client in the list
        clientSockets.push(socket);

        // Left everybody in the chat know we have a new user connected
        broadcast(socket.name + " joined the chat\n", socket);
      }
    }
  });

  // Remove the client from the list when it leaves
  socket.on('end', function() {
    if (isAuth(socket)) {
      clientSockets.splice(clientSockets.indexOf(socket), 1);
      broadcast(socket.name + " left the chat.\n");
    }
  });

  // Disconnect everybody who doesn't login after 5 seconds
  setTimeout(function() {
    if (!isAuth(socket)) {
      socket.write("Sorry, your login time is up!\n");
      disconnect(socket);
    }
  }, 5000);

}).listen(port);

// Put a friendly message on the terminal of the server.
console.log("Chat server running on port " + port);
