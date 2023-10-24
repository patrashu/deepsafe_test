import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: 'None',
  isLogin: false,
};

export const userSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    onUpdateData: (state, action) => {
      state.email = action.payload.email.split('@')[0];
      state.isLogin = action.payload.isLogin;
    },
  },
});

export const { onUpdateData } = userSlice.actions;
