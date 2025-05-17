// src/types/transaction.ts

export interface TransactionBase {
  category_id: number;
  amount: number;
  description?: string;
}

export interface TransactionCreate extends TransactionBase {
  type: 'income' | 'expense';
  created_at: string; // ISO-date string
}

export interface TransactionUpdate extends Partial<TransactionBase> {}

export interface CategoryRead {
  id: number;
  name: string;
  type: 'income' | 'expense';
}

export interface TransactionRead extends TransactionBase {
  type: "income" | "expense";
  id: number;
  user_id: number;
  created_at: string;      // ISO-date string
  category: CategoryRead;  // развёрнутая информация по категории
}
