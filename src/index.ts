import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import './calendar/year';

@customElement('app-index')
export class AppIndex extends LitElement {
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
    return html`
      <h1>Swimcal</h1>
      <calendar-year></calendar-year>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-index': AppIndex;
  }
}
