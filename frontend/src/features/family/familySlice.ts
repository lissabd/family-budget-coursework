import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../api/axios';

interface Family {
  id: number;
  code: string;
  created_at: string;
  members: number;
  transactions: number;
  balance: number;
}

interface FamilyState {
  data: Family | null;
  status: 'idle' | 'loading' | 'error';
}

const initialState: FamilyState = {
  data: null,
  status: 'idle',
};

export const fetchFamily = createAsyncThunk<Family>(
  'family/fetch',
  async () => {
    const res = await API.get<Family>('/families/me');
    return res.data;
  }
);

const familySlice = createSlice({
  name: 'family',
  initialState,
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(fetchFamily.pending, (state) => { state.status = 'loading'; })
    .addCase(fetchFamily.fulfilled, (state, action) => {
      state.status = 'idle';
      state.data = action.payload;
    })
    .addCase(fetchFamily.rejected, (state) => {
      state.status = 'error';
    }),
});

export default familySlice.reducer;
export type {FamilyState}