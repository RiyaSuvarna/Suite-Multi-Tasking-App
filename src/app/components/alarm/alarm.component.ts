import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Alarm {
  id: number;
  time: string;
  label: string;
  active: boolean;
  fired: boolean;
}

@Component({
  selector: 'app-alarm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.scss']
})
export class AlarmComponent implements OnInit, OnDestroy {
  now = new Date();
  alarms: Alarm[] = [];
  newAlarmTime = '';
  newAlarmLabel = '';
  idCounter = 1;
  private timer: any;
  firingAlarm: Alarm | null = null;
  selectedTimezone = 'Asia/Kolkata';

  // Expose Math to template
  Math = Math;

  timezones = [
    { label: 'IST (Mumbai)',      value: 'Asia/Kolkata' },
    { label: 'UTC',               value: 'UTC' },
    { label: 'EST (New York)',     value: 'America/New_York' },
    { label: 'PST (LA)',          value: 'America/Los_Angeles' },
    { label: 'GMT (London)',      value: 'Europe/London' },
    { label: 'CET (Paris)',       value: 'Europe/Paris' },
    { label: 'JST (Tokyo)',       value: 'Asia/Tokyo' },
    { label: 'SGT (Singapore)',   value: 'Asia/Singapore' }
  ];

  ngOnInit() {
    this.timer = setInterval(() => {
      this.now = new Date();
      this.checkAlarms();
    }, 1000);
  }

  getFormattedTime(): string {
    return this.now.toLocaleTimeString('en-US', {
      timeZone: this.selectedTimezone,
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
  }

  getFormattedDate(): string {
    return this.now.toLocaleDateString('en-US', {
      timeZone: this.selectedTimezone,
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  addAlarm() {
    if (!this.newAlarmTime) return;
    this.alarms.push({
      id: this.idCounter++,
      time: this.newAlarmTime,
      label: this.newAlarmLabel || 'Alarm',
      active: true,
      fired: false
    });
    this.newAlarmTime = '';
    this.newAlarmLabel = '';
  }

  removeAlarm(id: number) { this.alarms = this.alarms.filter(a => a.id !== id); }

  toggleAlarm(alarm: Alarm) { alarm.active = !alarm.active; alarm.fired = false; }

  checkAlarms() {
    const hhmm = this.now.toLocaleTimeString('en-US', {
      timeZone: this.selectedTimezone, hour: '2-digit', minute: '2-digit', hour12: false
    });
    for (const alarm of this.alarms) {
      if (alarm.active && !alarm.fired && alarm.time === hhmm) {
        alarm.fired = true;
        this.firingAlarm = alarm;
        setTimeout(() => { if (this.firingAlarm?.id === alarm.id) this.firingAlarm = null; }, 5000);
      }
    }
  }

  dismissAlarm() { this.firingAlarm = null; }

  getClockDeg(): { h: number; m: number; s: number } {
    const tzDate = new Date(this.now.toLocaleString('en-US', { timeZone: this.selectedTimezone }));
    const h = tzDate.getHours() % 12;
    const m = tzDate.getMinutes();
    const s = tzDate.getSeconds();
    return { h: h * 30 + m * 0.5, m: m * 6 + s * 0.1, s: s * 6 };
  }

  handX(deg: number, len: number): number { return 100 + len * Math.sin(deg * Math.PI / 180); }
  handY(deg: number, len: number): number { return 100 - len * Math.cos(deg * Math.PI / 180); }

  tickX(i: number, r: number): number { return 100 + r * Math.sin(i * 30 * Math.PI / 180); }
  tickY(i: number, r: number): number { return 100 - r * Math.cos(i * 30 * Math.PI / 180); }

  ngOnDestroy() { clearInterval(this.timer); }
}
