import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import 'water.css';
import './calendar/year';

import { Exercise, getSwimData, yearFilter } from './exercise';
import { createMemo } from './memo';
import Favicon from './favicon.svg';

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
      display: flex;
      align-items: center;
      justify-content: center;
    }
    h1 > img {
      height: 1.6em;
      width: 1.6em;
      margin-right: 0.2em;
      margin-top: 0.38em; // To align with baseline of text
    }
    button {
      all: unset;
      color: var(--links);
      cursor: pointer;
      margin: 0 2rem;
      user-select: none;
    }
    footer {
      margin-top: 4rem;
      margin-bottom: 2rem;
      color: var(--text-muted);
      font-size: 0.5rem;
    }
    footer > a {
      color: var(--text-muted);
    }
  `;
  render() {
    const currentYearSwimData = swimMemo(() => {
      return this.swimData.filter(yearFilter(this.year));
    }, [this.year, this.swimData.length]);
    return html`
      <h1><img src="${Favicon}" width="32" height="32" /> Swimcal</h1>
      <calendar-year year="${this.year}" .swimData=${currentYearSwimData}>
        <button slot="prev" @click=${this._navigateToPreviousYear}>&lt;</button>
        <button slot="next" @click=${this._navigateToNextYear}>&gt;</button>
      </calendar-year>
      <footer>
        Favicon by Maxim Kulikov from
        <a
          target="_blank"
          rel="noreferrer noopener"
          href="https://thenounproject.com/term/swim/2713615/"
          >the Noun Project</a
        >
      </footer>
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
