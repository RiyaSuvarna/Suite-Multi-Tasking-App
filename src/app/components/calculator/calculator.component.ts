import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent {
  display = '0';
  expression = '';
  history: string[] = [];
  isResult = false;

  buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '−'],
    ['1', '2', '3', '+'],
    ['0', '.', '⌫', '=']
  ];

  press(key: string) {
    if (key === 'C') { this.clear(); return; }
    if (key === '⌫') { this.backspace(); return; }
    if (key === '=') { this.calculate(); return; }
    if (key === '±') { this.toggleSign(); return; }
    if (key === '%') { this.percent(); return; }

    const ops = ['÷', '×', '−', '+'];

    if (this.isResult && !ops.includes(key)) {
      this.display = '';
      this.expression = '';
      this.isResult = false;
    }

    if (ops.includes(key)) {
      this.expression = (this.isResult ? this.display : this.expression + this.display) + ' ' + key + ' ';
      this.display = '';
      this.isResult = false;
      return;
    }

    if (key === '.' && this.display.includes('.')) return;
    if (this.display === '0' && key !== '.') {
      this.display = key;
    } else {
      this.display += key;
    }
  }

  clear() { this.display = '0'; this.expression = ''; this.isResult = false; }

  backspace() {
    if (this.isResult) { this.clear(); return; }
    this.display = this.display.slice(0, -1) || '0';
  }

  toggleSign() {
    if (this.display !== '0') {
      this.display = this.display.startsWith('-') ? this.display.slice(1) : '-' + this.display;
    }
  }

  percent() {
    const val = parseFloat(this.display);
    if (!isNaN(val)) this.display = (val / 100).toString();
  }

  calculate() {
    const fullExpr = this.expression + this.display;
    try {
      const sanitized = fullExpr.replace(/÷/g, '/').replace(/×/g, '*').replace(/−/g, '-');
      const res = Function('"use strict"; return (' + sanitized + ')')();
      const rounded = Math.round(res * 1e10) / 1e10;
      this.history.unshift(`${fullExpr} = ${rounded}`);
      if (this.history.length > 6) this.history.pop();
      this.expression = fullExpr + ' =';
      this.display = String(rounded);
      this.isResult = true;
    } catch { this.display = 'Error'; }
  }

  isOperator(key: string) { return ['÷', '×', '−', '+'].includes(key); }
  isSpecial(key: string) { return ['C', '±', '%'].includes(key); }
}
