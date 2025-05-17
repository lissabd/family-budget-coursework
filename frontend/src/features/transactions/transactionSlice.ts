// src/features/transactions/transactionSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import API from '../../api/axios'
import type { TransactionCreate, TransactionRead } from '../../types/transaction'
import { RootState } from '../../app/types'


export interface CategoryItem {
  id: number
  name: string
  type: 'income' | 'expense'
}

export interface TransactionItem {
  id: number
  amount: number
  type: 'income' | 'expense'
  category: string
  created_at: string
}

interface TransactionsState {
  list: TransactionItem[]
  status: 'idle' | 'loading' | 'error'
}

const initialState: TransactionsState = {
  list: [],
  status: 'idle',
}

export const fetchRecentTransactions = createAsyncThunk<
  TransactionItem[],
  void,
  { state: RootState }
>(
  'transactions/fetchRecent',
  async (_, { getState }) => {
    const resp = await API.get<TransactionRead[]>('/transactions?limit=5')
    const cats: CategoryItem[] = getState().categories.list
    return resp.data.map(tx => {
      const found = cats.find(c => c.id === tx.category_id)
      return {
        id: tx.id,
        amount: tx.amount,
        type: tx.type,
        category: found?.name ?? '—',
        created_at: tx.created_at,
      }
    })
  }
)

export const fetchAllTransactions = createAsyncThunk<
  TransactionItem[],
  void,
  { state: RootState }
>(
  'transactions/fetchAll',
  async (_, { getState }) => {
    const resp = await API.get<TransactionRead[]>('/transactions')
    const cats: CategoryItem[] = getState().categories.list
    return resp.data.map(tx => {
      const found = cats.find(c => c.id === tx.category_id)
      return {
        id: tx.id,
        amount: tx.amount,
        type: tx.type,
        category: found?.name ?? '—',
        created_at: tx.created_at,
      }
    })
  }
)

export const createTransaction = createAsyncThunk<
  TransactionItem,
  TransactionCreate,
  { state: RootState }
>(
  'transactions/create',
  async (payload, { getState }) => {
    const resp = await API.post<TransactionRead>('/transactions', payload)
    const tx = resp.data
    const cats: CategoryItem[] = getState().categories.list
    const found = cats.find(c => c.id === tx.category_id)
    return {
      id: tx.id,
      amount: tx.amount,
      type: tx.type,
      category: found?.name ?? '—',
      created_at: tx.created_at,
    }
  }
)

const slice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(fetchRecentTransactions.pending, s => { s.status = 'loading' })
      .addCase(fetchRecentTransactions.fulfilled, (s, { payload }) => {
        s.status = 'idle'
        s.list = payload
      })
      .addCase(fetchRecentTransactions.rejected, s => { s.status = 'error' })

      .addCase(fetchAllTransactions.pending, s => { s.status = 'loading' })
      .addCase(fetchAllTransactions.fulfilled, (s, { payload }) => {
        s.status = 'idle'
        s.list = payload
      })
      .addCase(fetchAllTransactions.rejected, s => { s.status = 'error' })

      .addCase(createTransaction.fulfilled, (s, { payload }) => {
        s.list.unshift(payload)
      }),
})

export default slice.reducer
export type { TransactionsState }