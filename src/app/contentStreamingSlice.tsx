import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  video_src: "/test.mp4"
};

export const contentStreamingSlice = createSlice({
  name: 'contentStreamingSlice',
  initialState,
  reducers: {
    setVideoSrc: (state, action) => {
      state.video_src = action.payload.video_src;
    }
  },
});

export const { setVideoSrc } = contentStreamingSlice.actions;
