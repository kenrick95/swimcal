import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
  Exercise,
  formatCount,
  formatDistance,
  formatDuration,
  totalDistanceInKm,
  totalDurationInMs,
} from '../exercise';
import { createMemo } from '../memo';

const distanceMemo = createMemo();
const durationMemo = createMemo();

@customElement('calendar-day')
export class CalendarDay extends LitElement {
  static styles = css`
    .day {
      text-align: center;
      aspect-ratio: 1;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .count {
      position: absolute;
      right: 8px;
      top: 8px;
      font-size: 0.5rem;
      border-radius: 50%;
      background-color: hsl(212, 85%, 50%);
      width: 6px;
      height: 6px;
    }
  `;
  @property({ type: Number }) date: number = new Date().getDate();
  @property({ type: Number }) month: number = new Date().getMonth() + 1;
  @property({ type: Number }) year: number = new Date().getFullYear();
  @property({ type: Array }) swimData: Array<Exercise> = [];

  render() {
    const totalDistance = distanceMemo(
      () => totalDistanceInKm(this.swimData),
      [this.year, this.month, this.date, this.swimData.length]
    );
    const totalDuration = durationMemo(
      () => totalDurationInMs(this.swimData),
      [this.year, this.month, this.date, this.swimData.length]
    );

    return html`<div
      class="day"
      title=${this.swimData.length
        ? `${formatCount(this.swimData.length, [
            'swim',
            'swims',
          ])}, ${formatDistance(totalDistance)}, ${formatDuration(
            totalDuration
          )}`
        : null}
    >
      <div class="date">${this.date}</div>
      ${this.swimData.length ? html`<div class="count"></div>` : null}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'calendar-day': CalendarDay;
  }
}
