import { createSlice } from '@reduxjs/toolkit';
import { on } from 'events';

const initialState = {
  img_srcs: [],
  clickedImg: 'None',
  inferenceModel: 'resnet_18',
  inferenceImg: 'None',
  concatImg: 'None',
  isAsidebarOpen: true,
};

export const contentFileSlice = createSlice({
  name: 'contentFile',
  initialState,
  reducers: {
    onFileClick: (state, action) => {
      state.img_srcs = action.payload.imgPaths;
    },

    onTopImgClick: (state, action) => {
      state.clickedImg = action.payload.src;
    },

    onAsidebarToggle: (state) => {
      state.isAsidebarOpen = !state.isAsidebarOpen;
    },

    onInferenceModelChange: (state, action) => {
      state.inferenceModel = action.payload.model;
    },

    onInferenceImgChange: (state, action) => {
      state.inferenceImg = action.payload.img;
    },

    onConcatImgChange: (state, action) => {
      state.concatImg = action.payload.img;
    }
  },
});

export const { onFileClick, onTopImgClick, onAsidebarToggle, onInferenceModelChange, onInferenceImgChange, onConcatImgChange } = contentFileSlice.actions;
