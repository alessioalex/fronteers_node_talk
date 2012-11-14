var express = require('express')
  , app = express.createServer()
  , io = require('socket.io').listen(app)
  , request = require('request')
  , fs = require('fs')
  , EventEmitter = require('events').EventEmitter
  , AppEmitter = new EventEmitter()
  , SECRET_URL = '/admin123'
  , googleText = ''
  , toSpeechUrl = 'http://translate.google.com/translate_tts?tl=en&q='
  , PORT = 8080;

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  fs.readdir(__dirname + '/public/videos', function(err, videos) {
    if (err) { throw err; }

    res.render('index', { layout: false, videos: videos });
  });
});

app.get(SECRET_URL, function (req, res) {
  fs.readdir(__dirname + '/public/music', function(err, songs) {
    if (err) { throw err; }

    fs.readdir(__dirname + '/public/videos', function(err, videos) {
      if (err) { throw err; }

      res.render('admin', {
        layout : false,
        songs  : songs,
        videos : videos,
        admUrl : SECRET_URL
      });
    });

  });
});

app.get(SECRET_URL + '/playVideo/:name', function(req, res) {
  AppEmitter.emit('playVideo', req.params.name);
  res.send('ok');
});

app.get(SECRET_URL + '/playSong/:name', function(req, res) {
  AppEmitter.emit('playSong', req.params.name);
  res.send('ok');
});

app.get(SECRET_URL + '/voice/:msg', function(req, res) {
  AppEmitter.emit('playVoice', req.params.msg);
  res.send('ok');
});

app.get('/sound.mp3', function(req, res) {
  request.get(toSpeechUrl + encodeURIComponent(googleText)).pipe(res);
});

io.sockets.on('connection', function (socket) {
  // ..
});

AppEmitter.on('playSong', function(song) {
  io.sockets.emit('playSong', song);
});

AppEmitter.on('playVideo', function(video) {
  io.sockets.emit('playVideo', video);
});

AppEmitter.on('playVoice', function(msg) {
  googleText = msg;
  io.sockets.emit('playVoice', msg);
});

app.listen(PORT);
