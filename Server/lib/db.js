class DB {
  constructor() {
    
    if(!DB.instance){
      this.userList = [];
      this.messageList = [];
      DB.instance = this;
    }

    return DB.instance;
  }
  

  addUser = (user) => {
    return this.userList.push(user);
  }

  findByUserRoomId = (roomId) => {
     
     let users = this.userList.filter((user) => {
       console.log(user)
       return user['roomId'] === roomId;
     })

     console.log('Users : ', users);
     return users;
  }

  findByUserId = (id) => {
    console.log('[DB]::findByUserId::id::', id);
    let users = this.userList.filter((user) => {
      console.log('[DB]::findByUserId::',user);
      return user.id === id;
    })

    console.log('Users : ', users);
    return users;
 }

  removeUser = (user) => {
      console.log('Removing User : ', user);

      this.userList.forEach((element, index) => {
          if(element.email === user.email){ 
            const deletedUser = this.userList.splice(index, 1);
            console.log('Deleted User : ', deletedUser);
          }
      });

      console.log(this.userList);
  }

  removeUserById = (id) => {
      this.userList.forEach((element, index) => {
        if(element.id === id){
          this.userList.splice(index, 1);
        }
      })
  }

  listUsers = () => {
    return this.userList;
  }

  isUserExistInRoom = (user) => {
    const userObj = this.userList.find(userObj => userObj.email === user.email && userObj.roomId === user.roomId);
    console.log('>>>', userObj,  userObj !== undefined ? userObj.length > 0 : false);
    return userObj !== undefined ? true : false;
  }

  //functions for messages//
  addMessege = (message) => {
    return this.messageList.push(message);
  }

  //display message.
  displayMesseges = () => {
    return this.messageList;
  }

  //findMessges
  findMessageByRoomID(roomId){
    console.log(this.messageList)
    let messages = this.messageList.filter((message) => {
        return message.roomId === roomId;
    })  

    return messages;
  }
}

const DBConnection = new DB();
Object.freeze(DBConnection);

module.exports = {DBConnection};