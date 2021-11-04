import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('calendar-month')
export class CalendarMonth extends LitElement {
  static styles = css`
    h3 {
      text-align: center;
    }
    .dates {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
      grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
      grid-gap: 2px;
    }
    .dates > div {
      text-align: center;
      aspect-ratio: 1;
    }
  `;
  @property({ type: Number }) month: number = new Date().getMonth() + 1;
  @property({ type: Number }) year: number = new Date().getFullYear();
  render() {
    let yearMonth = `${this.year}-${pad(this.month)}`;
    let yearMonthDate = new Date(yearMonth);
    let maxDateOfMonth = getMaxDateOfMonth(yearMonthDate);

    let dateEls = [];
    for (let i = 0; i < yearMonthDate.getDay(); i++) {
      dateEls.push(html`<div>&nbsp;</div>`);
    }
    for (let i = 0; i < maxDateOfMonth; i++) {
      dateEls.push(html`<div>${i + 1}</div>`);
    }

    return html`
      <section>
        <h3>${yearMonthDate.toLocaleString('default', { month: 'long' })}</h3>

        <div class="dates">${dateEls}</div>
      </section>
    `;
  }
}

function pad(number: number): string {
  return number < 10 ? `0${String(number)}` : String(number);
}

/**
 * Given a Date, what is the max date of month: 28, 29, 30, or 31?
 */
function getMaxDateOfMonth(date: Date): number {
  let nextMonth =
    date.getMonth() === 11
      ? `${date.getFullYear() + 1}-01`
      : `${date.getFullYear()}-${pad(date.getMonth() + 2)}`;
  let nextMonthDate = new Date(nextMonth);
  let lastMonthDate = new Date(nextMonthDate.getTime() - 24 * 3600 * 1000);
  return lastMonthDate.getDate();
}

declare global {
  interface HTMLElementTagNameMap {
    'calendar-month': CalendarMonth;
  }
}
