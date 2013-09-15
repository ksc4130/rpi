var gpio = require("gpio")
    , floodLightsSwitch
    , lightsSwitch;

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
    device(27, {
      name: 'Lights'
    }),
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
            device.set(data.state, function() {
                console.log(device.value);
                io.sockets.emit('change', {id: data.id, state: device.value});
            });
        else
            console.log("can't find device for id ", data.id);
    });
});

floodLightsSwitch = gpio.export(22, {
    ready: function() {
        floodLightsSwitch.on("change", function(val) {
            if(val === 1)
                return;

            var device = devices[17];

            if(device)
                device.set((1 - device.value), function() {
                    console.log(device.value);
                    io.sockets.emit('change', {id: 17, state: device.value});
                });
            else
                console.log("can't find device for id ", 17);
        });
    }
});

lightsSwitch = gpio.export(23, {
    ready: function() {
        lightsSwitch.on("change", function(val) {
            if(val === 1)
                return;

            var device = devices[27];

            if(device)
                device.set((1 - device.value), function() {
                    console.log(device.value);
                    io.sockets.emit('change', {id: 27, state: device.value});
                });
            else
                console.log("can't find device for id ", 27);
        });
    }
});