import {configureStore} from '@reduxjs/toolkit';
import authSlice from '../Features/authSlice';
import userSlice from '../Features/userSlice';
import absensiSlice from '../Features/absensiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    absensi: absensiSlice,
  },
  devTools: false,
});
