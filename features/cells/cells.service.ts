
import { supabase } from '../../lib/supabase';
import { Cell } from '../../types';

export const cellsService = {
  async getCellsBySheet(sheetId: string): Promise<Cell[]> {
    const { data, error } = await supabase
      .from('cells')
      .select('*')
      .eq('sheet_id', sheetId);

    if (error) throw error;
    return data || [];
  },

  async updateCell(sheetId: string, rowIndex: number, colIndex: number, value: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // First, check if cell exists
    const { data: existingCell } = await supabase
      .from('cells')
      .select('id')
      .match({ sheet_id: sheetId, row_index: rowIndex, col_index: colIndex })
      .single();

    if (existingCell) {
      const { error } = await supabase
        .from('cells')
        .update({ value })
        .eq('id', existingCell.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('cells')
        .insert([{
          sheet_id: sheetId,
          row_index: rowIndex,
          col_index: colIndex,
          value,
          user_id: user.id
        }]);
      if (error) throw error;
    }
  }
};
