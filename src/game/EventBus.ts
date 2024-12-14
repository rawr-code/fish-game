import { EFishColor, EGameEventType } from '@types';
import { EventSystem } from '@systems';

export const eventSystem = new EventSystem();

interface ISetupEventListeners {
  onUpdateSpawnTime: (time: number) => void;
  onTogglePause: (isPaused: boolean) => void;
  countVisibleFish: (color: EFishColor, expectedCount: number) => void;
}

export const setupEventListeners = ({
  onUpdateSpawnTime,
  onTogglePause,
  countVisibleFish,
}: ISetupEventListeners) => {
  eventSystem.on(EGameEventType.UPDATE_SPAWN_TIME, time => {
    onUpdateSpawnTime(time);
  });
  eventSystem.on(EGameEventType.TOGGLE_PAUSE, (isPaused: boolean) => {
    onTogglePause(isPaused);
  });
  eventSystem.on(EGameEventType.COUNT_FISH, ({ color, expectedCount }) => {
    countVisibleFish(color, expectedCount);
  });
};

export const updateSpawnTime = (time: number) => {
  eventSystem.emit({
    type: EGameEventType.UPDATE_SPAWN_TIME,
    payload: time,
  });
};

export const togglePause = (isPaused: boolean) => {
  eventSystem.emit({
    type: EGameEventType.TOGGLE_PAUSE,
    payload: isPaused,
  });
};
