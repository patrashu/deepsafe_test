import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: 'closed',
  currentTab: 'project',
};

export const sidebarSlice = createSlice({
  name: 'sidebarMenu',
  initialState,
  reducers: {
    onMenuClick: (state, action) => {
      {state.currentTab === action.payload.tabName ? (
        state.isOpen === 'open' ?
          state.isOpen = "closed" :
          state.isOpen = "open"
      ) : (
        state.currentTab = action.payload.tabName,
        state.isOpen = 'open'
      )}
    },
  },
});

export const { onMenuClick } = sidebarSlice.actions;
