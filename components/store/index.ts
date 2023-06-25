import { configureStore } from '@reduxjs/toolkit';
import leadsReducer from './leadsSlice';
import sidebarReducer from './sidebarSlice';
import userReducer from '../redux/userSlice';
import messageReducer from './messageSlice';
import playButtonReducer from './playButtonSlice'

export const store = configureStore({
    reducer: {
        leads: leadsReducer,
        sidebar: sidebarReducer,
        user: userReducer,
        message: messageReducer,
        playButton: playButtonReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({ thunk: true }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
