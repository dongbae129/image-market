import { createSlice } from '@reduxjs/toolkit';

interface userStates {
  accessToken: string | null;
  restoreState: boolean;
  logedIn: boolean;
}
export const initialState: userStates = {
  accessToken: '',
  restoreState: false,
  logedIn: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    removeAccessToken: (state) => {
      state.accessToken = null;
    },
    setRestoreState: (state, action) => {
      state.restoreState = action.payload;
    },
    setLogedIn: (state, action) => {
      state.logedIn = action.payload;
    }
  }
});
export const {
  setAccessToken,
  removeAccessToken,
  setRestoreState,
  setLogedIn
} = userSlice.actions;

export default userSlice.reducer;
