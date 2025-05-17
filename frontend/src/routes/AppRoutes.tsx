// src/routes/AppRoutes.tsx
import React, { JSX } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Transactions from '../pages/Transactions'
import TransactionForm from '../pages/TransactionForm'

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuth = !!useAppSelector(state => state.auth.user)
  return isAuth ? children : <Navigate to="/login" replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard/></ProtectedRoute>
      }/>
      <Route path="/transactions" element={
        <ProtectedRoute><Transactions/></ProtectedRoute>
      }/>
      <Route path="/transaction/new" element={
        <ProtectedRoute><TransactionForm/></ProtectedRoute>
      }/>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
