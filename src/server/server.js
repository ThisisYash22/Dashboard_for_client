const mqtt = require('mqtt');
const WebSocket = require('ws');

const MQTT_IP = 'mqtt://localhost:1883';
const MQTT_TOPIC = 'test/topic';

const options = {
    clientId: 'mqttjs_' + Math.random().toString(16).slice(2, 10),
    protocolId: 'MQTT'
};

const client = mqtt.connect(MQTT_IP, options);

const wss = new WebSocket.Server({ port: 8080 });

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    setInterval(() => {
        const data = {
            vals: [
                { id: 'electricity', val: (Math.random() * 100).toFixed(2) },
                { id: 'temperature', val: (Math.random() * 100).toFixed(2) },
                { id: 'humidity', val: (Math.random() * 100).toFixed(2) },
                { id: 'water', val: (Math.random() * 100).toFixed(2) }
            ]
        };
        const message = JSON.stringify(data);
        client.publish(MQTT_TOPIC, message, () => {
            console.log(`Published message: ${message}`);
        });
    }, 5000); // Publish data every 8 seconds
});
