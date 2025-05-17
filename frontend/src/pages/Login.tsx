// src/pages/Login.tsx
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Alert } from '@mui/material';

import { Navigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loginUser } from '../features/auth/authSlice';

export default function Login() {
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector(s => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (user) return <Navigate to="/" replace />;

  const onSubmit = () => {
    dispatch(loginUser({ email, password }));
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Вход</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Email"
        fullWidth margin="normal"
        value={email} onChange={e => setEmail(e.target.value)}
      />
      <TextField
        label="Пароль"
        type="password" fullWidth margin="normal"
        value={password} onChange={e => setPassword(e.target.value)}
      />
      <Button
        variant="contained" fullWidth sx={{ mt: 2 }}
        onClick={onSubmit} disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Загрузка…' : 'Войти'}
      </Button>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </Typography>
    </Container>
  );
}
