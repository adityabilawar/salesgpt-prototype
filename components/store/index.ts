import { configureStore } from '@reduxjs/toolkit';
import leadsReducer from './leadsSlice';
import sidebarReducer from './sidebarSlice';
import userReducer from '../redux/userSlice';

export const store = configureStore({
    reducer: {
        leads: leadsReducer,
        sidebar: sidebarReducer,
        user: userReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({ thunk: true }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
