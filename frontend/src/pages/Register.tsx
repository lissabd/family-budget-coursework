// src/pages/Register.tsx
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Alert } from '@mui/material';

import { Navigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { registerUser } from '../features/auth/authSlice';

export default function Register() {
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector(s => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [familyCode, setFamilyCode] = useState<string | undefined>(undefined);

  if (user) return <Navigate to="/" replace />;

  const onSubmit = () => {
    dispatch(registerUser({ email, password, family_code: familyCode }));
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Регистрация</Typography>
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
      <TextField
        label="Код семьи (необязательно)"
        fullWidth margin="normal"
        value={familyCode ?? ''} onChange={e => setFamilyCode(e.target.value)}
      />
      <Button
        variant="contained" fullWidth sx={{ mt: 2 }}
        onClick={onSubmit} disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Загрузка…' : 'Зарегистрироваться'}
      </Button>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </Typography>
    </Container>
  );
}
