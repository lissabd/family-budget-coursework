import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import transactionsReducer from '../features/transactions/transactionSlice'
import familyReducer from '../features/family/familySlice'
import categoriesReducer from '../features/categories/categorySlice'

export const rootReducer = combineReducers({
  auth: authReducer,
  transactions: transactionsReducer,
  family: familyReducer,
  categories: categoriesReducer,
})
