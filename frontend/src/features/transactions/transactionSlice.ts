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

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(fetchRecentTransactions.pending, (s) => { s.status = 'loading'; })
    .addCase(fetchRecentTransactions.fulfilled, (s, a) => {
      s.status = 'idle';
      s.list = a.payload;
    })
    .addCase(fetchRecentTransactions.rejected, (s) => {
      s.status = 'error';
    }),
});

export default transactionSlice.reducer;
