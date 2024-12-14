export enum EGameEventType {
  UPDATE_SPAWN_TIME = 'UPDATE_SPAWN_TIME',
  UPDATE_DIFFICULTY = 'UPDATE_DIFFICULTY',
}

export interface UpdateSpawnTimeEvent {
  type: EGameEventType.UPDATE_SPAWN_TIME;
  payload: number;
}

export interface UpdateDifficultyEvent {
  type: EGameEventType.UPDATE_DIFFICULTY;
  payload: 'easy' | 'normal' | 'hard';
}

export type TGameEvent = UpdateSpawnTimeEvent | UpdateDifficultyEvent;

export type TPayloadType<T extends EGameEventType> = Extract<
  TGameEvent,
  { type: T }
>['payload'];

export interface IGameEvent {
  type: EGameEventType;
  payload?: unknown;
}
