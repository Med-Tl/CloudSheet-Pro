
export interface Sheet {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
}

export interface Cell {
  id: string;
  sheet_id: string;
  row_index: number;
  col_index: number;
  value: string;
}

export type GridData = Record<string, Record<number, string>>;
