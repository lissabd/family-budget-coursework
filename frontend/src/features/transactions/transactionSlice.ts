import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../api/axios';


interface Transaction {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  created_at: string;
}

interface TransactionsState {
  list: Transaction[];
  status: 'idle' | 'loading' | 'error';
}

const initialState: TransactionsState = {
  list: [],
  status: 'idle',
};

export const fetchRecentTransactions = createAsyncThunk<Transaction[]>(
  'transactions/fetchRecent',
  async () => {
    const res = await API.get<Transaction[]>('/transactions?limit=5');
    return res.data;
  }
);

export const fetchAllTransactions = createAsyncThunk<Transaction[]>(
  'transactions/fetchAll',
  async () => {
    const res = await API.get<Transaction[]>('/transactions');
    return res.data;
  }
);


const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(fetchRecentTransactions.pending, (state) => { state.status = 'loading'; })
    .addCase(fetchRecentTransactions.fulfilled, (state, action) => {
      state.status = 'idle';
      state.list = action.payload;
    })
    .addCase(fetchRecentTransactions.rejected, (state) => {
      state.status = 'error';
    })
    .addCase(fetchAllTransactions.pending, (state) => { state.status = 'loading'; })
    .addCase(fetchAllTransactions.fulfilled, (state, action) => {
      state.status = 'idle';
      state.list = action.payload;
    })
    .addCase(fetchAllTransactions.rejected, (state) => { state.status = 'error'; })    
});

export default transactionSlice.reducer;
