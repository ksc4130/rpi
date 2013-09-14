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


var server = require('http').createServer(handler)
    , io = require('socket.io').listen(server)
    , fs = require('fs');

server.listen(4130);

function handler (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    fs.createReadStream(__dirname + '/index.html').pipe(res);
}

io.sockets.on('connection', function (socket) {
    socket.emit('init', (gpio17.value === 1));
    socket.on('change', function (data) {
        gpio17.set(data ? 1 : 0, function() {
            console.log(gpio17.value);
            socket.emit('change', (gpio17.value === 1));
        });
    });
});