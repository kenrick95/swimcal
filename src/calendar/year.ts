import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
  Exercise,
  formatCount,
  formatDistance,
  formatDuration,
  totalDistanceInKm,
  totalDurationInMs,
  yearMonthFilter,
} from '../exercise';
import { createMemo } from '../memo';

import './month';

const yearMonthMemo = new Array(12).fill(null).map(() => createMemo());
const distanceMemo = createMemo();
const durationMemo = createMemo();

@customElement('calendar-year')
export class CalendarYear extends LitElement {
  static styles = css`
    :host {
    }
    h2 {
      text-align: center;
    }
    .stats {
      display: flex;
      width: 33.3%;
      margin-left: auto;
      margin-right: auto;
    }
    .stats > div {
      min-width: 0;
      margin-left: auto;
      margin-right: auto;
    }
    .months {
      margin-top: 2rem;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 1fr 1fr 1fr 1fr;
      grid-gap: 1.6rem;
    }
  `;
  @property({ type: Number }) year: number = new Date().getFullYear();
  @property({ type: Array }) swimData: Array<Exercise> = [];

  render() {
    const totalDistance = distanceMemo(
      () => totalDistanceInKm(this.swimData),
      [this.year, this.swimData.length]
    );
    const totalDuration = durationMemo(
      () => totalDurationInMs(this.swimData),
      [this.year, this.swimData.length]
    );
    const yearMonthSwimData = [];

    let content = [];
    for (let i = 0; i < 12; i++) {
      yearMonthSwimData[i] = yearMonthMemo[i](() => {
        return this.swimData.filter(yearMonthFilter(this.year, i + 1));
      }, [this.year, i + 1, this.swimData.length]);

      content.push(
        html`
          <calendar-month
            year="${this.year}"
            month="${i + 1}"
            .swimData=${yearMonthSwimData[i]}
          ></calendar-month>
        `
      );
    }
    return html`
      <h2>
        <slot name="prev"></slot>
        ${this.year}
        <slot name="next"></slot>
      </h2>
      <div class="stats">
        <div>${formatCount(this.swimData.length, ['swim', 'swims'])}</div>
        <div>${formatDistance(totalDistance)}</div>
        <div>${formatDuration(totalDuration)}</div>
      </div>
      <div class="months">${content}</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'calendar-year': CalendarYear;
  }
}
