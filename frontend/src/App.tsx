// src/App.tsx
import React from 'react'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import Header from './components/Header'
import AppRoutes from './routes/AppRoutes'
import { Provider } from 'react-redux'
import { store } from './app/store'

const darkTheme = createTheme({ palette: { mode: 'dark' } })

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline /> {/* Сбрасывает дефолтные стили, заливает фон тёмным */}
        <BrowserRouter>
          <Header />
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  )
}
