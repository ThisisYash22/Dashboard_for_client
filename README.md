**Realtime Dashboard for Bottle Line Plant Monitoring**

I developed a Realtime Dashboard Application to monitor a bottle filling process.
The project involved collecting, storing, and visualizing data in real-time using modern technologies like Angular, Node.js, MQTT, and InfluxDB — all orchestrated with Docker.


**What I Built**

**1. Data Collection and Storage**
  - Developed a Data Collector using Node.js which subscribes to an internal MQTT broker.
  - The collector fetches live data published from an S7-1500 PLC (via Simatic-v1/s7c1) and writes it into an InfluxDB time-series database.
    
**3. Simulator Development (Dummy Server)**
  - Since sometimes a physical PLC was not available for testing the application, I built a Node.js server that generates dummy values (mimicking real plant           sensor data).
  - This Server Image publishes simulated data onto the MQTT broker, enabling full testing of the system without real hardware.
    
**2. Realtime Data Visualization**
  - Built a dynamic Angular dashboard to visualize the real-time data trends with the help of chart.js.
  - Integrated WebSocket communication using Node.js backend to push updated values from InfluxDB to the Angular frontend.

**4. Containerization using Docker**
  - Created four Docker images:
  - Angular Frontend (for visualization)
  - InfluxDB Database (for storing time-series data)
  - Data Collector Service (Node.js app subscribing to MQTT and writing to InfluxDB)
  - Data Publisher (for publishing dummy data without physical need of plc for development use)
  - Wrote a Docker Compose YAML file to automate the deployment of all four services together.


**Technologies Used**
Frontend: Angular 16
Backend: Node.js
Database: InfluxDB V1
Protocol: MQTT (Message Queuing Telemetry Transport) Protocol
Containerization: Docker, Docker Compose
Realtime Communication: WebSockets


**Behind the scenes:**
<img width="1255" alt="Screenshot 2025-04-27 at 3 05 16 PM" src="https://github.com/user-attachments/assets/02dff124-01da-4404-94cb-ab0f4e5c7bbf" />

<img width="1280" alt="Screenshot 2025-04-27 at 3 04 40 PM" src="https://github.com/user-attachments/assets/45bba7b6-96b9-4969-b2a3-b165f300ed71" />


**Dashboard Visualization:**
<img width="1219" alt="Screenshot 2025-04-27 at 3 06 12 PM" src="https://github.com/user-attachments/assets/df5d701e-0513-4ed9-86d7-7b6bd46d2f51" />

