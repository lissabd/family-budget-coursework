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
    .addCase(fetchFamily.pending, (s) => { s.status = 'loading'; })
    .addCase(fetchFamily.fulfilled, (s, a) => {
      s.status = 'idle';
      s.data = a.payload;
    })
    .addCase(fetchFamily.rejected, (s) => {
      s.status = 'error';
    }),
});

export default familySlice.reducer;
