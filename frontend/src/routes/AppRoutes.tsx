// src/routes/AppRoutes.tsx
import { useAppSelector } from '@/app/hooks';
import React, { JSX } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Login       from '@/pages/Login';
// import Register    from '@/pages/Register';
// import Dashboard   from '@/pages/Dashboard';
// import Transactions from '@/pages/Transactions';
// import NewTransaction from '@/pages/NewTransaction';
// import Settings    from '@/pages/Settings';


// function ProtectedRoute({ children }: { children: JSX.Element }) {
//   const isAuth = !!useAppSelector(state => state.auth.user);
//   return isAuth ? children : <Navigate to="/login" replace />;
// }

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/transaction/new" element={<ProtectedRoute><NewTransaction /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
