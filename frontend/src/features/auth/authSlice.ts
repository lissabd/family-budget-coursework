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
    .addCase(fetchMe.pending, (s) => { s.status = 'loading'; })
    .addCase(fetchMe.fulfilled, (s, a) => {
      s.status = 'idle';
      s.user = a.payload;
    })
    .addCase(fetchMe.rejected, (s) => {
      s.status = 'error';
      s.user = null;
    })
    .addCase(login.fulfilled, (s, a) => {
      s.user = a.payload;
    })
    .addCase(register.fulfilled, (s, a) => {
      s.user = a.payload;
    })
    .addCase(logout.fulfilled, (s) => {
      s.user = null;
    }),
});

export default authSlice.reducer;
