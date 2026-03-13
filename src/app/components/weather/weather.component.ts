import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit {
  city = '';
  weather: any = null;
  forecast: any[] = [];
  loading = false;
  error = '';

  weatherIcons: Record<string, string> = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌁',
    Haze: '🌫️',
    Smoke: '💨',
  };

  // Replace with your key from https://openweathermap.org/api
  private API_KEY = '9a71058235dedf1be4b8285dd4a564b0';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.search();
  }

  search() {
    if (!this.city.trim()) return;

    this.loading = true;
    this.error = '';

    this.http
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${this.API_KEY}&units=metric`,
      )
      .subscribe({
        next: (data: any) => {
          this.weather = data;
          this.loading = false;
          this.cdr.detectChanges(); // 👈 force UI update
        },
        error: () => {
          this.weather = this.getDemoWeather();
          this.forecast = this.getDemoForecast();
          this.loading = false;
          this.cdr.detectChanges(); // 👈 force UI update
        },
      });

    this.http
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${this.city}&appid=${this.API_KEY}&units=metric&cnt=5`,
      )
      .subscribe({
        next: (data: any) => {
          this.forecast = data.list?.slice(0, 5) || [];
          this.cdr.detectChanges(); // 👈 force UI update
        },
        error: () => {
          this.forecast = this.getDemoForecast();
          this.cdr.detectChanges(); // 👈 force UI update
        },
      });
  }

  getIcon(main: string): string {
    return this.weatherIcons[main] || '🌡️';
  }

  getWindDirection(deg: number): string {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return dirs[Math.round(deg / 45) % 8];
  }

  getDemoWeather() {
    return {
      name: this.city,
      sys: { country: 'IN', sunrise: 1704328740, sunset: 1704370260 },
      weather: [{ main: 'Clear', description: 'clear sky' }],
      main: { temp: 28, feels_like: 30, humidity: 72, pressure: 1012, temp_min: 24, temp_max: 32 },
      wind: { speed: 3.5, deg: 220 },
      visibility: 10000,
    };
  }

  getDemoForecast() {
    const icons = ['Clear', 'Clouds', 'Rain', 'Clear', 'Clouds'];
    return icons.map((w, i) => ({
      dt_txt: new Date(Date.now() + i * 86400000).toISOString(),
      weather: [{ main: w, description: w.toLowerCase() }],
      main: { temp: 25 + Math.random() * 8, humidity: 60 + i * 3 },
    }));
  }

  formatTime(unix: number): string {
    return new Date(unix * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatDay(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
  }
}
