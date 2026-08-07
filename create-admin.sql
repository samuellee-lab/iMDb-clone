-- Create admin user for iMDb CMS
-- Run in Supabase SQL Editor

-- Create admin user with email admin@imdb.com and password 123456
-- This uses Supabase's internal auth functions
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@imdb.com',
  crypt('123456', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"display_name":"samlee"}',
  now(),
  now(),
  '',
  ''
);
