import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { UserRead, LoginData, RegisterData } from '../../types/auth';
import API from '../../api/axios';

interface AuthState {
  user: UserRead | null;
  status: 'idle' | 'loading' | 'error';
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
};

export const login = createAsyncThunk<UserRead, LoginData>(
  'auth/login',
  async (data) => {
    const resp = await API.post<UserRead>('/auth/login', data);
    return resp.data;
  }
);

export const register = createAsyncThunk<UserRead, RegisterData>(
  'auth/register',
  async (data) => {
    const resp = await API.post<UserRead>('/auth/register', data);
    return resp.data;
  }
);

export const logout = createAsyncThunk<void>(
  'auth/logout',
  async () => {
    await API.post('/auth/logout');
  }
);

export const fetchMe = createAsyncThunk<UserRead>(
  'auth/fetchMe',
  async () => {
    const resp = await API.get<UserRead>('/auth/me');
    return resp.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(fetchMe.pending, (state) => { state.status = 'loading'; })
    .addCase(fetchMe.fulfilled, (state, action) => {
      state.status = 'idle';
      state.user = action.payload;
    })
    .addCase(fetchMe.rejected, (state) => {
      state.status = 'error';
      state.user = null;
    })
    .addCase(login.fulfilled, (state, action) => {
      state.user = action.payload;
    })
    .addCase(register.fulfilled, (state, action) => {
      state.user = action.payload;
    })
    .addCase(logout.fulfilled, (state) => {
      state.user = null;
    }),
});

export default authSlice.reducer;
export type {AuthState}