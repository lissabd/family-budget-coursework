import { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';

import { register } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [familyCode, setFamilyCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(register({
        email, password,
        family_code: familyCode || undefined,
      })).unwrap();
      navigate('/dashboard');
    } catch {
      alert('Ошибка при регистрации');
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" gutterBottom>Регистрация</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email" fullWidth margin="normal" value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <TextField
          label="Пароль" fullWidth margin="normal" type="password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <TextField
          label="Код семьи (если есть)" fullWidth margin="normal"
          value={familyCode} onChange={(e) => setFamilyCode(e.target.value)} />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Зарегистрироваться
        </Button>
      </form>
       <Typography variant="body2" sx={{ mt: 2 }}>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </Typography>
    </Container>
  );
}
