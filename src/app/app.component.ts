import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import ChartZoom from 'chartjs-plugin-zoom';
import 'chartjs-adapter-luxon';
import ChartStreaming from 'chartjs-plugin-streaming';
Chart.register(ChartStreaming);
Chart.register(ChartZoom);

interface DataPoint {
  time: Date;
  id: string;
  value: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Test-App';
  data: DataPoint[] = [];
  chart!: Chart;
  datasetsMap: Map<string, any> = new Map(); // Map to hold dataset references
  

  private socket$: WebSocketSubject<any>;
  private chartContainer!: HTMLElement;
  streaming: boolean = true;
  constructor(private http: HttpClient) {
    this.socket$ = webSocket<DataPoint[]>('ws://'+location.hostname+':8000');
  }

  async ngOnInit(): Promise<void> {
    await this.setupWebSocket();
  }

  ngAfterViewInit(): void {
    this.chartContainer = document.querySelector('.chart-container') as HTMLElement;
  }

  setupWebSocket(): void {
    this.socket$.subscribe({
      next: (message: DataPoint[] | DataPoint) => {
        const dataPoints = Array.isArray(message) ? message : [message];
        if (this.data.length === 0) {
          // Initial data load
          this.data = dataPoints.map((item) => ({
            ...item,
            time: new Date(item.time),
          }));
          this.createChart();
        } else {
          // Subsequent updates
          this.updateChart(dataPoints);
        }
      },
      error: (error) => {
        console.error('WebSocket error:', error);
      },
      complete: () => {
        console.log('WebSocket connection closed');
      },
    });
  }

  createChart(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement | null;
    if (ctx) {
      this.data.forEach((item) => {
        if (!this.datasetsMap.has(item.id)) {
          this.datasetsMap.set(item.id, {
            label: item.id,
            data: [],
            borderColor: this.getRandomColor(),
            borderWidth: 1.5,
            fill: false,
            pointRadius: 3,
            tension: 0.3,
          });
        }
        this.datasetsMap.get(item.id).data.push({ x: new Date(item.time), y: item.value });
      });

      const datasets = Array.from(this.datasetsMap.values());
      console.log(datasets);
      const options: any = {
        scales: {
          x: {
            type: 'realtime',
            realtime: {
              duration: 90000,
              refresh: 1000,
              delay: 2000,
              cull: true,
            },
            title: {
              display: true,
              text: 'Time',
            }
          },
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Value',
            },
          },
        },
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'x',
            },
            pan: {
              enabled: true,
              mode: 'x',
            },
          },
        },
        tooltip: {
          intersect: false,
          mode: 'nearest',
        },
        animation: { // Enable animations
          duration: 1000,
        },
        transitions: {
          draw: {
            easing: 'easeInOutQuad', // Easing function for animation
            duration: 1000, // Duration of the transition animation
          },
        },
      };
      
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {  
          datasets: datasets,
        },
        options: options,
      });
    } else {
      console.error('Failed to get the chart element');
    }
  }

  updateChart(newData: DataPoint[]): void {
    newData.forEach((item: DataPoint) => {
      let variable = this.datasetsMap.get(item.id);
      if (!variable) {
        variable = {
          label: item.id,
          data: [],
          borderColor: this.getRandomColor(),
          borderWidth: 2,
          fill: false,
          pointRadius: 0,
        };
        this.datasetsMap.set(item.id, variable);
        this.chart.data.datasets.push(variable);
      }
      variable.data.push({ x: new Date(item.time), y: item.value });
      console.log(item.id,variable.data.length);
      
    });
    
     this.chart.update('none');
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  onScroll(): void {
    if (this.chart?.options?.plugins?.streaming) { // Optional Chaining
      const isAtBottom = this.chartContainer.scrollTop + this.chartContainer.clientHeight >= this.chartContainer.scrollHeight;
      this.chart.options.plugins.streaming.pause = !isAtBottom;
    }
  }
}

