// src/types/auth.ts
export interface UserCreate {
  email: string;
  password: string;
  family_code?: string;
}

export interface UserRead {
  id: number;
  email: string;
  family_id: number;
}
