import { IGameEvent, EGameEventType, TPayloadType } from '@types';

export class EventSystem {
  // eslint-disable-next-line @typescript-eslint/ban-types
  private eventHandlers: Map<EGameEventType, Function[]>;

  constructor() {
    this.eventHandlers = new Map();
  }

  on<T extends EGameEventType>(
    eventType: T,
    handler: (payload: TPayloadType<T>) => void,
  ) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)?.push(handler);
  }

  emit(event: IGameEvent) {
    const handlers = this.eventHandlers.get(event.type);
    if (handlers) {
      handlers.forEach(handler => handler(event.payload));
    }
  }

  destroy() {
    this.eventHandlers.clear();
  }
}

export const eventSystem = new EventSystem();

interface ISetupEventListeners {
  onUpdateSpawnTime: (time: number) => void;
}

export const setupEventListeners = ({
  onUpdateSpawnTime,
}: ISetupEventListeners) => {
  eventSystem.on(EGameEventType.UPDATE_SPAWN_TIME, time => {
    onUpdateSpawnTime(time);
  });
};

export const updateSpawnTime = (time: number) => {
  eventSystem.emit({
    type: EGameEventType.UPDATE_SPAWN_TIME,
    payload: time,
  });
};
