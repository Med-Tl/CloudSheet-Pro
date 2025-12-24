
# CloudSheet Pro

A professional Excel-like spreadsheet application built with React, TypeScript, and Supabase.

## Features
- **Full Auth Flow**: Sign up and Login with Supabase Auth.
- **Email Verification**: Mandatory email confirmation flow for new users.
- **Spreadsheet UI**: Familiar grid with selection system and formula bar.
- **Auto-Sync**: Every cell edit is immediately persisted to PostgreSQL.
- **Privacy**: RLS (Row Level Security) ensures you only see your own sheets.

## Database Setup
To use this app, ensure your Supabase instance has the following tables:

### 1. `sheets`
- `id`: uuid, primary key
- `created_at`: timestamp with time zone
- `user_id`: uuid (references auth.users)
- `name`: text

### 2. `cells`
- `id`: uuid, primary key
- `sheet_id`: uuid (references sheets.id)
- `user_id`: uuid (references auth.users)
- `row_index`: integer
- `col_index`: integer
- `value`: text

### RLS Policies
Enable RLS for both tables and add policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE` where `user_id = auth.uid()`.

## Supabase Auth Configuration
For the "Email Confirmation" feature to work:
1. Go to your **Supabase Dashboard**.
2. Navigate to **Authentication > Providers > Email**.
3. Ensure **Confirm Email** is toggled **ON**.
4. In **Authentication > URL Configuration**, ensure your site URL is added to the allow list.

## Environment Variables
- `VITE_SUPABASE_URL`: Your Supabase Project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key
