
import { supabase } from '../../lib/supabase';
import { Sheet } from '../../types';

export const sheetsService = {
  async getSheets(): Promise<Sheet[]> {
    const { data, error } = await supabase
      .from('sheets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getSheetById(id: string): Promise<Sheet | null> {
    const { data, error } = await supabase
      .from('sheets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createSheet(name: string): Promise<Sheet> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { data, error } = await supabase
      .from('sheets')
      .insert([{ name, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteSheet(id: string): Promise<void> {
    const { error } = await supabase
      .from('sheets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
