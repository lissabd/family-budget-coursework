import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../api/axios';


export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
}

interface State {
  list: Category[];
  status: 'idle' | 'loading' | 'error';
}

const initialState: State = {
  list: [],
  status: 'idle',
};

export const fetchCategories = createAsyncThunk<Category[]>(
  'categories/fetch',
  async () => {
    const res = await API.get<Category[]>('/categories');
    return res.data;
  }
);

const slice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchCategories.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'idle';
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => { state.status = 'error'; }),
});

export default slice.reducer;
export type {State}