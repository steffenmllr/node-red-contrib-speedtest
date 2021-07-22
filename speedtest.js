"use strict";

var speedTest = require("speedtest-net");

module.exports = exports = function (RED) {
    function SpeedTest(config) {
        RED.nodes.createNode(this, config);
        this.on("input", function (msg) {
            const node = this;
            const { acceptLicense, serverId, acceptGdpr, maxTime } = config;
            node.status({ fill: "yellow", shape: "dot", text: "Requesting" });
            speedTest({
                acceptLicense,
                acceptGdpr,
                serverId,
                maxTime,
            })
                .then((result) => {
                    msg.payload = Object.assign({}, result, { config: config });
                    node.status({ fill: "green", shape: "dot" });
                    node.send(msg);
                })
                .catch((err) => {
                    node.status({
                        fill: "red",
                        shape: "dot",
                        text: err.message,
                    });
                    node.error(err, msg);
                });
        });
    }

    RED.nodes.registerType("speedtest", SpeedTest);
};
