import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  addProject: false,
  clickedIdx: 'None',
  clickedName: 'None',
  tabComponents: [],
  projectComponents: [
    {name: 'Project1', datetime: '2023-02-13'},
    {name: 'Project2', datetime: '2023-02-14'},
    {name: 'Project3', datetime: '2023-02-15'},
    {name: 'Project4', datetime: '2023-02-16'},
  ],
};

export const contentProjectSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    onProjectClick: (state, action) => {
      switch (action.payload.sender) {
        case "sideItem":
          if (state.tabComponents.findIndex(e => e.name === action.payload.name) === -1) {
            state.tabComponents = [
              ...state.tabComponents,
              {
                name: action.payload.name,
              }
            ],
            state.clickedIdx = state.tabComponents.length - 1
            state.clickedName = action.payload.name;
          }
          else {
            state.clickedIdx = state.tabComponents.findIndex(e => e.name === action.payload.name);
            state.clickedName = action.payload.name;
          };
          break;
        case "tabItem":
          state.clickedIdx = state.tabComponents.findIndex(e => e.name === action.payload.name);
          state.clickedName = action.payload.name;
          break;
        default:
          break;
      }
    },

    onProjectAdd: (state, action) => {
      let newProject = {
        name: action.payload.name,
        datetime: action.payload.datetime,
      }
      state.projectComponents = [
        ...state.projectComponents, newProject
      ];
    },

    onToggleAddPeoject: (state, action) => {
      state.addProject = action.payload.flag;
    },

    onProjectRemoveClick: (state) => {
      const currentIdx = state.tabComponents.findIndex(e => e.name === state.clickedName);
      state.tabComponents = state.tabComponents.filter((obj) => obj.name !== state.clickedName);
      state.projectComponents = state.projectComponents.filter((obj) => obj.name !== state.clickedName);
      state.tabComponents.length === 0 ?
        (
          state.clickedIdx = 'None',
          state.clickedName = 'None'
        ) : (
          state.clickedIdx = (currentIdx >= state.tabComponents.length) ? state.tabComponents.length - 1 : currentIdx,
          state.clickedName = state.tabComponents[state.clickedIdx].name
        )
    },

    onTabRemoveClick: (state, action) => {
      const currentIdx = state.tabComponents.findIndex(e => e.name === action.payload.name);
      state.tabComponents = state.tabComponents.filter((obj) => obj.name !== action.payload.name);
      state.tabComponents.length === 0 ?
        (
          state.clickedIdx = 'None',
          state.clickedName = 'None'
        ) : (
          state.clickedIdx = (currentIdx >= state.tabComponents.length) ? state.tabComponents.length - 1 : currentIdx,
          state.clickedName = state.tabComponents[state.clickedIdx].name
        )
    },
  },
});

export const { onProjectClick, onProjectAdd, onToggleAddPeoject, onTabRemoveClick, onProjectRemoveClick } = contentProjectSlice.actions;
