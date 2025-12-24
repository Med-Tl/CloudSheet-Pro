
import { supabase } from '../../lib/supabase';
import { LoginParams, RegisterParams } from './auth.types';

export const authService = {
  async login({ email, password }: LoginParams) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async register({ email, password }: RegisterParams) {
    // Construct a clean redirect URL. 
    // Supabase needs this URL to be in your 'Redirect URLs' whitelist in the dashboard.
    const baseUrl = window.location.origin + window.location.pathname;
    const redirectUrl = baseUrl.endsWith('/') ? `${baseUrl}#/login` : `${baseUrl}/#/login`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    
    if (error) throw error;
    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};
