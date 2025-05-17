import {
  Button, Container, MenuItem, TextField, Typography,
  Select, FormControl, InputLabel
} from '@mui/material'
import { useEffect, useState } from 'react'
import { fetchCategories } from '../features/categories/categorySlice'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { CategoryItem, createTransaction } from '../features/transactions/transactionSlice'

export default function TransactionForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const categories = useAppSelector(s => s.categories.list) as CategoryItem[]

  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [description, setDescription] = useState('')
  const [createdAt, setCreatedAt] = useState(() => new Date().toISOString().slice(0, 10))

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await dispatch(createTransaction({
      amount: parseFloat(amount),
      category_id: +categoryId,
      type,
      description: description || undefined,
      created_at: new Date(createdAt).toISOString(),
    }))
    navigate('/transactions')
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>Создать транзакцию</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth margin="normal" label="Сумма"
          type="number" value={amount} onChange={e => setAmount(e.target.value)}
        />
        <TextField
          fullWidth margin="normal" label="Дата"
          type="date" value={createdAt}
          onChange={e => setCreatedAt(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Тип</InputLabel>
          <Select
            value={type}
            label="Тип"
            onChange={e => setType(e.target.value as 'income' | 'expense')}
          >
            <MenuItem value="income">Доход</MenuItem>
            <MenuItem value="expense">Расход</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Категория</InputLabel>
          <Select
            value={categoryId}
            label="Категория"
            onChange={e => setCategoryId(e.target.value)}
          >
            {categories
              .filter(c => c.type === type)
              .map((cat: CategoryItem) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
        <TextField
          fullWidth margin="normal" label="Описание"
          value={description} onChange={e => setDescription(e.target.value)}
        />
        <Button sx={{ mt: 2 }} type="submit" variant="contained">Создать</Button>
      </form>
    </Container>
  )
}
