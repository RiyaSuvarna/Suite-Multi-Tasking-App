import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherComponent } from './components/weather/weather.component';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { CurrencyComponent } from './components/currency/currency.component';
import { AlarmComponent } from './components/alarm/alarm.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, WeatherComponent, CalculatorComponent, CurrencyComponent, AlarmComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  activeTab = 0;
  currentTime = '';
  private timer: any;

  constructor(private cdr: ChangeDetectorRef) {}

  tabs = [
    { label: 'Weather', icon: '🌤' },
    { label: 'Calculator', icon: '🧮' },
    { label: 'Currency', icon: '💱' },
    { label: 'Alarm', icon: '⏰' },
  ];

  ngOnInit() {
    this.updateClock();

    this.timer = setInterval(() => {
      this.updateClock();
      this.cdr.detectChanges(); // 👈 force UI refresh every second
    }, 1000);
  }

  updateClock() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
