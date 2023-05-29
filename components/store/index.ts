import { configureStore } from '@reduxjs/toolkit';
import leadsReducer from './leadsSlice';
import sidebarReducer from './sidebarSlice';

export const store = configureStore({
    reducer: {
        leads: leadsReducer,
        sidebar: sidebarReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;