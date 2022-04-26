import { createSlice } from '@reduxjs/toolkit';

const initState = {
  userId: '',
  email: '',
  children: [],
  selected: null,
  loggedInChild: '',
  loggedInChildsParent: '',
  child: {},
};

// En slice sätter upp och håller reda på logiken för en reducer och dess state
// i detta fall allt state som är kopplat till en user.
export const userSlice = createSlice({
  name: 'user',
  initialState: initState,
  // Vi skapar en reducer för varje förändring av en stateful variabel.
  reducers: {
    loadUserId: (state, action) => {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
    },
    loadChildId: (state, action) => {
      state.loggedInChild = action.payload.userName;
      state.loggedInChildsParent = action.payload.parent;
    },
    addChild: (state, action) => {
      state.children.push([action.payload.name, action.payload]);
    },
    clearUserState: (state) => {
      state.userId = initState.userId;
      state.email = initState.email;
      state.children = initState.children;
      state.loggedInChild = initState.loggedInChild;
      state.loggedInChildsParent = initState.loggedInChildsParent;
      state.child = initState.child;
    },
    streamData: (state, action) => {
      if (action.payload) {
        const objectToDestruct = Object.values(action.payload);
        state.children = Object.values(objectToDestruct[0]);
      }
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    loadChild: (state, action) => {
      state.child = action.payload; 
    },
    removeChild: (state, action) => {
      state.children = state.children.filter((child) => child.userName !== action.payload); 
    },
  },
});

// Här exporterar vi varje reducer som vi vill använda
export const {
  loadUserId,
  loadChildId,
  addChild,
  clearUserState,
  streamData,
  setSelected,
  loadChild,
  removeChild,
} = userSlice.actions;

// Här exporterar vi state för slicen så att vi kommer åt det från resten av appen
export const userReduxState = (state) => state.user;

// Här gör vi kopplingen till våran store
export default userSlice.reducer;
