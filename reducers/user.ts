import { createSlice } from '@reduxjs/toolkit';

interface userStates {
  accessToken: string | null;
}
export const initialState: userStates = {
  accessToken: ''
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
    }
  }
});
export const { setAccessToken, removeAccessToken } = userSlice.actions;

export default userSlice.reducer;
