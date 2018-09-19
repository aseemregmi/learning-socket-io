const { User } = require('./users');
const expext = require('expect');

describe('Users', () => {
  let users;

  beforeEach(() => {
    users = new User();
    users.users = [
      {
        id: 1,
        name: 'Aseem Regmi',
        room: 'Node Discussion Forum'
      },
      {
        id: 2,
        name: 'Jen',
        room: 'React Course'
      },
      {
        id: 3,
        name: 'Julie',
        room: 'Node Discussion Forum'
      }
    ];
  });

  it('should add new Users', () => {
    const users = new User();

    const user = {
      id: 123,
      name: 'Aseem',
      room: 'Node'
    };
    users.addUser(user.id, user.name, user.room);

    expext(users.users).toEqual([user]);
  });

  it('should remove a user', () => {
    const userId = 1;
    const user = users.removeUser(userId);

    expext(user).toBeTruthy();
    expext(user.id).toBe(userId);
    expext(users.users.length).toBe(2);
  });

  it('should not remove user', () => {
    const userId = 10;
    const user = users.removeUser(userId);

    expext(user).toBeFalsy();
    expext(users.users.length).toBe(3);
  });

  it('should find user', () => {
    const user = users.getUser(2);
    expext(user).toEqual({
      id: 2,
      name: 'Jen',
      room: 'React Course'
    });
  });

  it('should not find user', () => {
    const user = users.getUser(100);
    expext(user).toBeFalsy();
  });

  it('should return list of users for node discussion forum', () => {
    let userList = users.getUserList('Node Discussion Forum');
    expext(userList).toEqual(['Aseem Regmi', 'Julie']);
  });

  it('should return list of users for react course', () => {
    let userList = users.getUserList('React Course');
    expext(userList).toEqual(['Jen']);
  });
});
