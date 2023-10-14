import { User, UserProps } from './models/User';
import { Collection } from './models/core/Collection';
import { UserList } from './views/UserList';

const endpoint = 'http://localhost:3000/users';
const root = document.getElementById('root');

const users = new Collection(endpoint, (json: UserProps) =>
  User.buildUser(json)
);
users.fetch();

if (root) users.on('change', () => new UserList(root, users).render());
