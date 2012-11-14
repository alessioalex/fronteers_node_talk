// In Node, almost everything emits and reacts to events: http server, tcp server, file reader, etc

var EventEmitter = require('events').EventEmitter,
    util         = require('util'),
    myEmitter    = new EventEmitter();

myEmitter.on('message', function(name, msg) {
  console.log(name + ': ' + msg);
});

setTimeout(function() {
  myEmitter.emit('message', 'Alex', 'hello');
}, 3000);

// your own class can inherit from EventEmitter
function Person(name, age) {
  this.name = name;
  this.age = age;
}

util.inherits(Person, EventEmitter);

var alex = new Person('Alex', 25);

alex.on('greet', function(from) {
  console.log(from + ' said hello to ' + alex.name);
});

setTimeout(function() {
  alex.emit('greet', 'nodejs');
}, 2000);
