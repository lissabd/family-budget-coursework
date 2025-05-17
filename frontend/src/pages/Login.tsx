import { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';

import { login } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();
      navigate('/dashboard');
    } catch {
      alert('Неверный email или пароль');
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100vh'
      }}
    >
      <Typography variant="h5" gutterBottom>Вход</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email" fullWidth margin="normal" value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <TextField
          label="Пароль" fullWidth margin="normal" type="password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Войти
        </Button>
      </form>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </Typography>
    </Container>
  );
}
