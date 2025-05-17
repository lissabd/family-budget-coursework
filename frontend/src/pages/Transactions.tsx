import { useEffect } from 'react'
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchAllTransactions } from '../features/transactions/transactionSlice'
import type { TransactionItem } from '../features/transactions/transactionSlice'

export default function Transactions() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { list: transactions, status } = useAppSelector(s => s.transactions)

  useEffect(() => {
    dispatch(fetchAllTransactions())
  }, [dispatch])

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Все транзакции</Typography>
      <Button sx={{ mb: 2 }} variant="contained" onClick={() => navigate('/transaction/new')}>
        Создать транзакцию
      </Button>

      {status === 'loading' && <Typography>Загрузка...</Typography>}
      {status === 'error' && <Typography color="error">Ошибка загрузки</Typography>}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Дата</TableCell>
            <TableCell>Категория</TableCell>
            <TableCell>Тип</TableCell>
            <TableCell>Сумма</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(transactions as TransactionItem[]).map(tx => (
            <TableRow key={tx.id}>
              <TableCell>{new Date(tx.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{tx.category}</TableCell>
              <TableCell>{tx.type === 'income' ? 'Доход' : 'Расход'}</TableCell>
              <TableCell>{tx.amount} ₽</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  )
}
