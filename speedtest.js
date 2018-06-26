'use strict';

var speedTest = require('speedtest-net');

module.exports = exports = function(RED) {
    function SpeedTest(config) {
        var timeout = config.maxTime || 5 * 1000;
        RED.nodes.createNode(this, config);

        this.on('input', msg => {
            this.status({ fill: 'yellow', shape: 'dot', text: 'Requesting' });
            var test = speedTest({ maxTime: config.maxTime });

            test.on('data', data => {
                var response = Object.assign({}, data, { config: config });
                this.status({});

                msg.payload = response;

                this.send(msg);
            });

            test.on('error', err => {
                this.status({ fill: 'red', shape: 'dot', text: err.message });
                this.error(err, msg);
            });
        });
    }

    RED.nodes.registerType('speedtest', SpeedTest);
};
