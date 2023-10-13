import { AxiosPromise, AxiosResponse } from 'axios';

interface ModelAttrs<T> {
  get<K extends keyof T>(key: K): T[K];
  getAll(): T;
  set(update: T): void;
}

interface Sync<T> {
  fetch(id: number): AxiosPromise;
  save(data: T): AxiosPromise;
}

interface Events {
  on(eventName: string, callback: () => void): void;
  trigger(eventName: string): void;
}

export interface HasId {
  id?: number;
}

export abstract class Model<T extends HasId> {
  constructor(
    private attributes: ModelAttrs<T>,
    private events: Events,
    private sync: Sync<T>
  ) {}

  get = this.attributes.get;
  getAll = this.attributes.getAll;

  set(update: T): void {
    this.attributes.set(update);
    this.events.trigger('change');
  }

  on = this.events.on;
  trigger = this.events.trigger;

  fetch(): void {
    const id = this.get('id');
    if (!id) throw new Error('Cannot fetch without an id');
    this.sync
      .fetch(id)
      .then((response: AxiosResponse): void => this.set(response.data));
  }

  save(): void {
    this.sync
      .save(this.getAll())
      .then((response: AxiosResponse): void => this.trigger('save'))
      .catch(() => this.trigger('error'));
  }
}
