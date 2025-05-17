import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logout } from '../features/auth/authSlice'

export default function Header() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(state => state.auth.user);

  const handleLogout = async () => {
    await dispatch(logout()).unwrap()
    navigate('/login')
  }

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component={Link}
          to="/dashboard"
          sx={{ color: 'inherit', textDecoration: 'none' }}
        >
          Family Budget
        </Typography>
        <Box>
          <Button component={Link} to="/dashboard" color="inherit">
            Главная
          </Button>
          <Button component={Link} to="/transactions" color="inherit">
            Транзакции
          </Button>
          {user ? (
          <Button color="inherit" onClick={handleLogout}>Выйти</Button>
        ) : (
          <></>
        )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
