import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import './calendar/year';

import { Exercise, getSwimData, yearFilter } from './exercise';
import { createMemo } from './memo';

const swimMemo = createMemo();

@customElement('app-index')
export class AppIndex extends LitElement {
  @state()
  private year: number = new Date().getFullYear();

  @state()
  private swimData: Array<Exercise> = [];

  constructor() {
    super();
    getSwimData().then((data) => {
      this.swimData = data;
    });
  }

  static styles = css`
    :host {
      display: block;
      max-width: 960px;
      margin: 0 auto;
    }
    h1 {
      text-align: center;
    }
  `;
  render() {
    const currentYearSwimData = swimMemo(() => {
      return this.swimData.filter(yearFilter(this.year));
    }, [this.year, this.swimData.length]);
    return html`
      <h1>Swimcal</h1>
      <button @click=${this._navigateToPreviousYear}>&lt;</button>
      <button @click=${this._navigateToNextYear}>&gt;</button>
      <calendar-year year="${this.year}" .swimData=${currentYearSwimData}></calendar-year>
    `;
  }

  private _navigateToPreviousYear() {
    this.year -= 1;
  }
  private _navigateToNextYear() {
    this.year += 1;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-index': AppIndex;
  }
}
