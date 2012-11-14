/*

As you may know, Node.js is single threaded, just like JavaScript is in the browser.
That means you need to be careful not to block the event loop.
How do you do that? Just like in the browser: setTimeout, setInterval and
Node's way with process.nextTick(), similar to setTimeout(fn, 1)

*/

// Bad
//*

for (var i = 0; i < 50; i++) {
  console.log(i + ' ' + Date.now());
}
console.log('This message will be displayed at the end of the loop :(');
//*/

// Better
/*

for (var i = 0; i < 50; i++) {
  setTimeout(function() {
    console.log(i + ' ' + Date.now());
  }, 1);
}
console.log("This message will be displayed before the loop even started, since it doesn't block anymore");
//*/

// Best
/*

for (var i = 0; i < 50; i++) {
  process.nextTick(function() {
    console.log(i + ' ' + Date.now());
  });
}
console.log("This message will be displayed before the loop even started, since it doesn't block anymore");
//*/
