import { IComponent } from './Component';

export interface IEntity {
  id: string;
  components: Map<string, IComponent>;
  addComponent(component: IComponent): void;
  getComponent<T extends IComponent>(type: string): T | undefined;
  hasComponent(type: string): boolean;
  removeComponent(type: string): void;
}
