var gpio = require("gpio");

var deviceIdCnt = 0;
var devices = {};

var device = function (pin, args) {
    if(!pin || typeof pin !== 'number')
        throw {
            name: 'invalid device pin/id',
            message: 'invalid device pin/id'
        };

    var self = new function() {};

    args = args || {};

    self.id = pin;
    self.name = args.name || 'unknown';
    self.state = args.state || 0;
    self.direction = args.direction || 'out';

    devices[pin.toString()] = gpio.export(pin, {
        direction: args.direction || 'out',
        interval: 200,
        ready: function() {
        }
    });

    return self;
};

var barn = [
  device(17, {
      name: 'Flood Lights'
  })
];

var floodLights = gpio.export(17, {
    direction: 'out',
    interval: 200,
    ready: function() {
    }
});

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
    socket.emit('init', barn);
    socket.on('change', function (data) {
        var device = devices[data.id];

        if(device)
            device.set(data ? 1 : 0, function() {
                console.log(device.value);
                io.sockets.emit('change', {id: data.id, state: device.value});
            });
        else
            console.log("can't find device for id ", data.id);
    });
});