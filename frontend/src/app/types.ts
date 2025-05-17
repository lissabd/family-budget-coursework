// src/app/types.ts

import type { AuthState } from '../features/auth/authSlice'
import type { TransactionsState } from '../features/transactions/transactionSlice'
import type { FamilyState } from '../features/family/familySlice'
import type { State } from '../features/categories/categorySlice'

export interface RootState {
  auth: AuthState
  transactions: TransactionsState
  family: FamilyState
  categories: State
}
