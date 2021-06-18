const initialState = {
  auth: false,
  id: "",
  name: "",
  email: "",
  image: "",
  preloading: true,
  socket: "",
  messages: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOADED": {
      const myState = { ...state };
      myState.preloading = false;
      return myState;
    }
    case "SOCKET": {
      const myState = { ...state };
      myState.socket = action.socket;
      return myState;
    }
    case "LOGIN": {
      const myState = { ...state };
      myState.auth = true;
      myState.name = action.name;
      myState.id = action.id;
      myState.email = action.email;
      myState.image = action.image;
      return myState;
    }
    case "LOGOUT": {
      const myState = { ...state };
      myState.auth = false;
      myState.name = "";
      myState.id = "";
      myState.email = "";
      myState.image = "";
      myState.messages = "";
      localStorage.removeItem("chat-app");
      myState.socket.emit("user-disconnected");
      return myState;
    }

    case "STORE_MESSAGE": {
      const message = action.message;
      const conversationId = action.conversationId;
      const myState = { ...state };

      const index = myState.messages.findIndex(
        (e) => e.conversationId === conversationId
      );

      if (index < 0) {
        myState.messages.push({
          conversationId,
          messages: [message],
        });
      } else {
        myState.messages[index].messages.push(message);
      }

      return myState;
    }

    default:
      return state;
  }
};

export default reducer;
