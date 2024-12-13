import { Component } from '@components';

export class Entity {
  private components: Map<string, Component> = new Map();
  public readonly id: string;

  constructor() {
    this.id = Math.random().toString(36).substr(2, 9);
  }

  addComponent(component: Component): void {
    this.components.set(component.type, component);
  }

  getComponent<T extends Component>(type: string): T | undefined {
    return this.components.get(type) as T;
  }

  hasComponent(type: string): boolean {
    return this.components.has(type);
  }

  hasComponents(types: string[]): boolean {
    return types.every(type => this.components.has(type));
  }

  removeComponent(type: string): void {
    this.components.delete(type);
  }
}
