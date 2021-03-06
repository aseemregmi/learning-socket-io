[
  {
    id: '',
    name: '',
    room: ''
  }
];

// Add User (id,name,roomname)
// removeUser (id)
// getuser
// getuserlist(roomname)

class User {
  constructor() {
    this.users = [];
  }
  addUser(id, name, room) {
    let user = {
      id,
      name,
      room
    };
    this.users.push(user);
    return user;
  }
  removeUser(id) {
    const user = this.getUser(id);
    if (user) {
      this.users = this.users.filter(user => user.id !== id);
    }
    return user;
  }
  getUser(id) {
    return this.users.filter(user => user.id === id)[0];
  }
  getUserList(room) {
    let users = this.users.filter(user => user.room === room);
    let namesArray = users.map(user => user.name);
    return namesArray;
  }
  getAllAvailableRooms() {
    let rooms = this.users.map(user => user.room);
    let unique = new Set();
    return rooms.filter(room => {
      if (!unique.has(room)) {
        unique.add(room);
        return true;
      }
    });
  }
}

module.exports = {
  User
};
