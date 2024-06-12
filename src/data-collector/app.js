const fs = require("fs");
const Influx = require("influx");
const mqtt = require("mqtt");
const express = require("express");
const cors = require("cors");
const WebSocket = require('ws');
const app = express();
const server = require('http').createServer(app);
const PORT = 8000;

// const MQTT_IP = "mqtt://server:1883";
const MQTT_IP = "tcp://ie-databus:1883";
const MQTT_TOPIC = "ie/d/j/simatic/v1/s7c1/dp/r/PLC_1/default";
const MQTT_USER = 'edge'
const MQTT_PASSWORD = 'edge'
const INFLUXDB_IP = "influxdb";
const INFLUXDB_DATABASE = "databus_values";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const options = {
  clientId: "mqttjs_" + Math.random().toString(16).slice(2, 10),
  protocolId: "MQTT",
  'username': MQTT_USER,
  'password': MQTT_PASSWORD
};

const client = mqtt.connect(MQTT_IP, options);

let isInfluxDBReady = false;

const wss = new WebSocket.Server({ server });

client.on("connect", () => {
  console.log("Connected to " + MQTT_IP);
  client.subscribe(MQTT_TOPIC, (err) => {
    if (err) {
      console.error("Failed to subscribe to " + MQTT_TOPIC + ":", err);
    } else {
      console.log("Subscribed to " + MQTT_TOPIC);
    }
  });
});

const influx = new Influx.InfluxDB({
  host: INFLUXDB_IP,
  database: INFLUXDB_DATABASE,
  port: 8086,
  username: "root",
  password: "root",
  schema: [
    {
      measurement: "uihqiuwhe",
      fields: {
        value: Influx.FieldType.FLOAT,
      },
      tags: ["id"],
    },
  ],
});

async function setupInfluxDB() {
  try {
    const names = await influx.getDatabaseNames();
    if (!names.includes(INFLUXDB_DATABASE)) {
      await influx.createDatabase(INFLUXDB_DATABASE);
      console.log(`Database "${INFLUXDB_DATABASE}" created`);
      isInfluxDBReady = true;
    } else {
      console.log(`Database "${INFLUXDB_DATABASE}" already exists`);
    }
  } catch (err) {
    console.error("Error setting up InfluxDB:", err);
  }
}

setupInfluxDB();

client.on("message", async (topic, message) => {
  console.log("Received message on topic:", topic);
  try {
    const msg = message.toString();
    const jsonmsg = JSON.parse(msg);
    console.log("Message content:", jsonmsg);

    for (const element of jsonmsg.vals) {
      await influx.writePoints([
        {
          measurement: "uihqiuwhe",
          tags: { id: element.id },
          fields: { value: Number(element.val) },
        },
      ]);

      const query = `
        SELECT * FROM uihqiuwhe
        WHERE id = '${element.id}'
        ORDER BY time DESC
        LIMIT 1`;

      const result = await influx.query(query);
      if (result.length > 0) {
        const latestEntry = result[0];
        const broadcastMessage = {
          time: latestEntry.time.toISOString(),
          id: latestEntry.id,
          value: latestEntry.value
        };
        console.log(broadcastMessage);
        broadcastMessageToClients(broadcastMessage);
      }
    }
  } catch (error) {
    console.error("Error processing message:", error);
  }
});

wss.on('connection', async (ws) => {
  
  if (!isInfluxDBReady) {
    console.log("InfluxDB is not ready yet. Closing WebSocket connection.");
    ws.close();
    return;
  }

  console.log('New WebSocket connection');
  try {
    // Fetch initial data
    const initialQuery = 'SELECT * FROM uihqiuwhe';
    const initialData = await influx.query(initialQuery);
    const formattedData = initialData.map(entry => ({
      time: entry.time.toISOString(),
      id: entry.id,
      value: entry.value
    }));
    // Send initial data to the new client
    ws.send(JSON.stringify(formattedData));
  } catch (error) {
    console.error("Error fetching initial data:", error);
  }

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

app.get("/", async (req, res) => {
  const initialQuery = 'SELECT * FROM uihqiuwhe';
    const initialData = await influx.query(initialQuery);
    const formattedData = initialData.map(entry => ({
      time: entry.time.toISOString(),
      id: entry.id,
      value: entry.value
    }));
    // Send initial data to the new client
    res.send(JSON.stringify(formattedData));
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

function broadcastMessageToClients(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}
