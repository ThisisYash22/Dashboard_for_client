**Realtime Dashboard for Bottle Line Plant Monitoring**

I developed a Realtime Dashboard Application to monitor a bottle filling process.
The project involved collecting, storing, and visualizing data in real-time using modern technologies like Angular, Node.js, MQTT, and InfluxDB — all orchestrated with Docker.


**What I Built**

**1. Data Collection and Storage**
  - Developed a Data Collector using Node.js which subscribes to an internal MQTT broker (Databus).
  - The collector fetches live data published from an S7-1500 PLC (via Simatic-v1/s7c1) and writes it into an InfluxDB time-series database.

**2. Realtime Data Visualization**
  - Built a dynamic Angular dashboard to visualize the real-time data trends with the help of chart.js.
  - Integrated WebSocket communication using Node.js backend to push updated values from InfluxDB to the Angular frontend.

**3. Containerization using Docker**
  - Created three Docker images:
  - Angular Frontend (for visualization)
  - InfluxDB Database (for storing time-series data)
  - Data Collector Service (Node.js app subscribing to MQTT and writing to InfluxDB)
  - Wrote a Docker Compose YAML file to automate the deployment of all three services together.

**4. Simulator Development (Dummy Server)**
  - Since sometimes a physical PLC was not available for testing, I built a Node.js server that generates dummy values (mimicking real plant sensor data).
  - This Server Image publishes simulated data onto the MQTT broker, enabling full testing of the system without real hardware.


**Technologies Used**
Frontend: Angular 16
Backend: Node.js
Database: InfluxDB V1
Protocol: MQTT (using internal Databus)
Containerization: Docker, Docker Compose
Realtime Communication: WebSockets


**Behind the scenes:**
<img width="1280" alt="Screenshot 2025-04-27 at 3 05 16 PM" src="https://github.com/user-attachments/assets/3bf5c2f6-3cf9-402b-a653-9fa63619c151" />

<img width="1280" alt="Screenshot 2025-04-27 at 3 04 40 PM" src="https://github.com/user-attachments/assets/45bba7b6-96b9-4969-b2a3-b165f300ed71" />


**Dashboard Visualization:**
<img width="1280" alt="Screenshot 2025-04-27 at 3 06 12 PM" src="https://github.com/user-attachments/assets/5d929177-8ab3-48d7-bfa9-1c1f014b23de" />

