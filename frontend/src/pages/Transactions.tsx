import { useEffect } from 'react';

import { fetchAllTransactions } from '../features/transactions/transactionSlice';
import {
  Container, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';

export default function Transactions() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list: transactions, status } = useAppSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchAllTransactions());
  }, [dispatch]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Все транзакции</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => navigate('/transaction/new')}>
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
          {transactions.map((tx) => (
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
  );
}
