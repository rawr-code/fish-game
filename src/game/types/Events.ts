import { EFishColor } from './Speech';

export enum EGameEventType {
  UPDATE_SPAWN_TIME = 'UPDATE_SPAWN_TIME',
  UPDATE_DIFFICULTY = 'UPDATE_DIFFICULTY',
  TOGGLE_PAUSE = 'TOGGLE_PAUSE',
  COUNT_FISH = 'COUNT_FISH',
}

export interface UpdateSpawnTimeEvent {
  type: EGameEventType.UPDATE_SPAWN_TIME;
  payload: number;
}

export interface UpdateDifficultyEvent {
  type: EGameEventType.UPDATE_DIFFICULTY;
  payload: 'easy' | 'normal' | 'hard';
}

export interface TogglePauseEvent {
  type: EGameEventType.TOGGLE_PAUSE;
  payload: boolean; // true para pausar, false para reanudar
}

export interface CountFishEvent {
  type: EGameEventType.COUNT_FISH;
  payload: {
    color: EFishColor;
    expectedCount: number;
  };
}

export type TGameEvent =
  | UpdateSpawnTimeEvent
  | UpdateDifficultyEvent
  | TogglePauseEvent
  | CountFishEvent;

export type TPayloadType<T extends EGameEventType> = Extract<
  TGameEvent,
  { type: T }
>['payload'];

export interface IGameEvent {
  type: EGameEventType;
  payload?: unknown;
}
