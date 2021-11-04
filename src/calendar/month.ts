import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
  Exercise,
  formatCount,
  formatDistance,
  formatDuration,
  totalDistanceInKm,
  totalDurationInMs,
  yearMonthDateFilter,
} from '../exercise';
import { createMemo } from '../memo';

import './day';

const yearMonthDateMemo = new Array(31).fill(null).map(() => createMemo());
const distanceMemo = createMemo();
const durationMemo = createMemo();

@customElement('calendar-month')
export class CalendarMonth extends LitElement {
  static styles = css`
    h3 {
      text-align: center;
      margin-top: 0;
      margin-bottom: 0.8rem;
    }
    .stats {
      display: flex;
    }
    .stats > div {
      min-width: 0;
      margin-left: auto;
      margin-right: auto;
    }
    .dates {
      margin-top: 1rem;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
      grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
      grid-gap: 2px;
    }
  `;
  @property({ type: Number }) month: number = new Date().getMonth() + 1;
  @property({ type: Number }) year: number = new Date().getFullYear();
  @property({ type: Array }) swimData: Array<Exercise> = [];

  render() {
    let yearMonth = `${this.year}-${pad(this.month)}`;
    let yearMonthDate = new Date(yearMonth);
    let maxDateOfMonth = getMaxDateOfMonth(yearMonthDate);

    const totalDistance = distanceMemo(
      () => totalDistanceInKm(this.swimData),
      [this.year, this.month, this.swimData.length]
    );
    const totalDuration = durationMemo(
      () => totalDurationInMs(this.swimData),
      [this.year, this.month, this.swimData.length]
    );

    const yearMonthDateSwimData = [];

    let dateEls = [];
    for (let i = 0; i < yearMonthDate.getDay(); i++) {
      dateEls.push(html`<div>&nbsp;</div>`);
    }
    for (let i = 0; i < maxDateOfMonth; i++) {
      yearMonthDateSwimData[i] = yearMonthDateMemo[i](() => {
        return this.swimData.filter(
          yearMonthDateFilter(this.year, this.month, i + 1)
        );
      }, [this.year, this.month, i + 1, this.swimData.length]);

      dateEls.push(
        html`<calendar-day
          year="${this.year}"
          month="${this.month}"
          date="${i + 1}"
          .swimData=${yearMonthDateSwimData[i]}
        ></calendar-day>`
      );
    }

    return html`
      <section>
        <h3>${yearMonthDate.toLocaleString('default', { month: 'long' })}</h3>
        <div class="stats">
          <div>${formatCount(this.swimData.length, ['swim', 'swims'])}</div>
          <div>${formatDistance(totalDistance)}</div>
          <div>${formatDuration(totalDuration)}</div>
        </div>
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
