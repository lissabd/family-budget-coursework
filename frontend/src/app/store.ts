// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './../features/auth/authSlice'
import transactionReducer from './../features/transactions/transactionSlice'
import familyReducer from '../features/family/familySlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    family: familyReducer,
  },
});


export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
