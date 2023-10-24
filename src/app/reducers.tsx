import { combineReducers } from "redux";
import { userSlice } from './userSlice';
import { sidebarSlice } from './sidebarSlice';
import { contentProjectSlice } from './contentProjectSlice';
import { contentFileSlice } from "./contentFileSlice";
import { contentStreamingSlice } from "./contentStreamingSlice";

export const rootReducer = combineReducers({
    user: userSlice.reducer,
    sidebar: sidebarSlice.reducer,
    contentProject: contentProjectSlice.reducer,
    contentFile: contentFileSlice.reducer,
    contentStreaming: contentStreamingSlice.reducer,
});
