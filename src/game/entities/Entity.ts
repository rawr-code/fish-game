import { IEntity, IComponent } from '@types';

class Entity implements IEntity {
  public id: string;
  public components: Map<string, IComponent>;

  constructor() {
    this.id = Math.random().toString(36).substr(2, 9);
    this.components = new Map();
  }

  addComponent(component: IComponent): void {
    this.components.set(component.type, component);
  }

  getComponent<T extends IComponent>(type: string): T | undefined {
    return this.components.get(type) as T;
  }

  hasComponent(type: string): boolean {
    return this.components.has(type);
  }

  removeComponent(type: string): void {
    this.components.delete(type);
  }
}

export default Entity;
