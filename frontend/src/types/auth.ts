export interface UserRead {
  id: number;
  email: string;
  joined_at: string;
  family_id: number | null;
}

export interface RegisterData {
  email: string;
  password: string;
  family_code?: string; // если указали код для подключения
}

export interface LoginData {
  email: string;
  password: string;
}
