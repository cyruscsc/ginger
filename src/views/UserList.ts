import { User, UserProps } from '../models/User';
import { UserShow } from './UserShow';
import { CollectionView } from './core/CollectionView';

export class UserList extends CollectionView<User, UserProps> {
  renderItem(model: User, itemParent: Element): void {
    new UserShow(itemParent, model).render();
  }
}
