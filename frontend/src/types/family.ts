export interface FamilyRead {
  id: number;
  code: string;
  created_at: string;
  members_count: number;
  transactions_count: number;
}

export interface FamilyJoin {
  code: string;
}
