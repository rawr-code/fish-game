import { IGameEvent, IEventComponent } from '@types';

export class EventComponent implements IEventComponent {
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
