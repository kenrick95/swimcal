import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Exercise } from '../exercise';

import './month';

@customElement('calendar-year')
export class CalendarYear extends LitElement {
  static styles = css`
    :host {
    }
    h2 {
      text-align: center;
    }
    .months {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 1fr 1fr 1fr 1fr;
      grid-gap: 1rem;
    }
  `;
  @property({ type: Number }) year: number = new Date().getFullYear();
  @property({ type: Array  }) swimData: Array<Exercise> = [];

  render() {
    console.log('currentYearSwimData', this.swimData);
    let content = [];
    for (let i = 0; i < 12; i++) {
      content.push(
        html`
          <calendar-month year="${this.year}" month="${i + 1}"></calendar-month>
        `
      );
    }
    return html`
      <h2>${this.year}</h2>
      <div>Number of swims: ${this.swimData.length}</div>
      <div class="months">${content}</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'calendar-year': CalendarYear;
  }
}
