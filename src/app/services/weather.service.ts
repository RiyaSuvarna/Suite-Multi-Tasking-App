// src/app/services/weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  // Sign up free at https://openweathermap.org/api to get your API key
  private API_KEY = 'YOUR_OPENWEATHER_API_KEY';
  private BASE_URL = 'https://api.openweathermap.org/data/2.5';

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    return this.http.get(
      `${this.BASE_URL}/weather?q=${city}&appid=${this.API_KEY}&units=metric`
    );
  }

  getForecast(city: string): Observable<any> {
    return this.http.get(
      `${this.BASE_URL}/forecast?q=${city}&appid=${this.API_KEY}&units=metric&cnt=5`
    );
  }
}
