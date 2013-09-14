var gpio = require("gpio");

// Calling export with a pin number will export that header and return a gpio header instance
var gpio17 = gpio.export(17, {
    // When you export a pin, the default direction is out. This allows you to set
    // the pin value to either LOW or HIGH (3.3V) from your program.
    direction: 'out',

    // set the time interval (ms) between each read when watching for value changes
    // note: this is default to 100, setting value too low will cause high CPU usage
    interval: 200,

    // Due to the asynchronous nature of exporting a header, you may not be able to
    // read or write to the header right away. Place your logic in this ready
    // function to guarantee everything will get fired properly
    ready: function() {
    }
});

function Toggle() {
    gpio17.set((1 - gpio17.value), function() {
        console.log(gpio17.value);    // should log 0
    });
}

//setInterval(Toggle, 500);

var app = require('http').createServer(handler)
    , io = require('socket.io').listen(app)
    , fs = require('fs')

app.listen(80);

function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

//var server = require('http').createServer(handler)
//    , io = require('socket.io').listen(server)
//    , fs = require('fs');
//
//server.listen(4130);
//
//function handler (req, res) {
//    res.setHeader('Content-Type', 'text/html');
//    res.writeHead(200);
//    fs.createReadStream(__dirname + '/index.html').pipe(res);
//}
////server = http.createServer(function server(req, res) {
////    res.writeHead(200);
////    res.setHeader('Content-Type', 'text/html');
////    fs.createReadStream(__dirname + '/index.html').pipe(res);
////}).listen(4130);
//
//io.sockets.on('connection', function (socket) {
//    socket.emit('news', { hello: 'world' });
//    socket.on('hello', function (data) {
//        console.log(data);
//    });
//});