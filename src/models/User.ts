import { AxiosResponse } from 'axios';
import { Attributes } from './Attributes';
import { Eventing } from './Eventing';
import { Sync } from './Sync';

const rootUrl = 'http://localhost:3000/users';

export interface UserProps {
  id?: number;
  name?: string;
  age?: number;
}

export class User {
  public attrs: Attributes<UserProps>;
  public events: Eventing = new Eventing();
  public sync: Sync<UserProps> = new Sync<UserProps>(rootUrl);

  constructor(attrs: UserProps) {
    this.attrs = new Attributes<UserProps>(attrs);
  }

  get get() {
    return this.attrs.get;
  }

  get getAll() {
    return this.attrs.getAll;
  }

  set(update: UserProps): void {
    this.attrs.set(update);
    this.events.trigger('change');
  }

  get on() {
    return this.events.on;
  }

  get trigger() {
    return this.events.trigger;
  }

  fetch(): void {
    const id = this.get('id');
    if (!id) throw new Error('Cannot fetch without an id');
    this.sync.fetch(id).then((res: AxiosResponse): void => this.set(res.data));
  }

  save(): void {
    this.sync
      .save(this.getAll())
      .then((res: AxiosResponse): void => this.trigger('save'))
      .catch(() => this.trigger('error'));
  }
}
