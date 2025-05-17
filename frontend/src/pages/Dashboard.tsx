import { useEffect } from 'react';
import { fetchFamily } from '../features/family/familySlice';
import { fetchRecentTransactions, TransactionItem } from '../features/transactions/transactionSlice';
import {
  Container, Typography, Card,
  CardContent, List, ListItem, ListItemText
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../app/hooks';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const family = useAppSelector(s => s.family.data);
  const transactions = useAppSelector(s => s.transactions.list);

  useEffect(() => {
    dispatch(fetchFamily());
    dispatch(fetchRecentTransactions());
  }, [dispatch]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Семейный бюджет</Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6">Текущий баланс:</Typography>
          <Typography variant="h4" color={family?.balance! >= 0 ? 'green' : 'red'}>
            {family?.balance ?? '...'} ₽
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>Последние транзакции:</Typography>
      <List>
        {transactions.map((tx: TransactionItem) => (
          <ListItem key={tx.id}>
            <ListItemText
              primary={`${tx.amount} ₽ • ${tx.category}`}
              secondary={new Date(tx.created_at).toLocaleDateString()}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
