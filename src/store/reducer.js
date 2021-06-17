const initialState = {
  auth: false,
  id: "",
  name: "",
  email: "",
  image: "",
  preloading: true,
  socket: "",
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
      localStorage.removeItem("chat-app");
      myState.socket.emit("user-disconnected");
      return myState;
    }

    default:
      return state;
  }
};

export default reducer;
