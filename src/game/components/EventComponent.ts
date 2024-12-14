import { IGameEvent } from '@types';
import { Component } from './Component';

export class EventComponent implements Component {
  public readonly type = 'event';

  events: IGameEvent[];

  constructor() {
    this.events = [];
  }

  addEvent(event: IGameEvent) {
    this.events.push(event);
  }

  clearEvents() {
    this.events = [];
  }
}
