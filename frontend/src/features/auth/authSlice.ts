// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserCreate, UserRead } from '../../types/auth';
import { fetchCurrentUser, login, logout, register } from '../../api/auth';


interface AuthState {
  user: UserRead | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: UserCreate, { rejectWithValue }) => {
    try {
      const user = await register(data);
      return user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    data: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      await login(data);
      const user = await fetchCurrentUser();
      return user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || err.message);
    }
  }
);

export const loadCurrentUser = createAsyncThunk(
  'auth/loadCurrent',
  async (_, { rejectWithValue }) => {
    try {
      const user = await fetchCurrentUser();
      return user;
    } catch (err: any) {
      return rejectWithValue(null);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    await logout();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.status = 'idle'; state.user = payload;
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.status = 'failed'; state.error = payload as string;
      })
      .addCase(loginUser.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.status = 'idle'; state.user = payload;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.status = 'failed'; state.error = payload as string;
      })
      .addCase(loadCurrentUser.fulfilled, (state, { payload }) => {
        state.user = payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
