import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Stub client when Supabase is not configured
const stubMethods = {
  from: () => ({
    select: () => ({ order: () => ({ limit: () => ({ then: (cb) => cb({ data: [], error: null }) }), eq: () => ({ single: () => ({ then: (cb) => cb({ data: null, error: { message: 'No Supabase configured' } }) }) }), contains: () => ({ order: () => ({ limit: () => ({ then: (cb) => cb({ data: [], error: null }) }) }) }), gte: () => ({ limit: () => ({ then: (cb) => cb({ data: [], error: null }) }) }), or: () => ({ then: (cb) => cb({ data: [], error: null }) }) }) }), insert: () => ({ select: () => ({ single: () => ({ then: (cb) => cb({ data: null, error: { message: 'No Supabase configured' } }) }) }) }), update: () => ({ eq: () => ({ select: () => ({ single: () => ({ then: (cb) => cb({ data: null, error: { message: 'No Supabase configured' } }) }) }) }) }), delete: () => ({ eq: () => ({ then: (cb) => cb({ error: null }) }) }), upsert: () => ({ then: (cb) => cb({ error: null }) }),
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'No Supabase configured' } }),
    signUp: () => Promise.resolve({ data: null, error: { message: 'No Supabase configured' } }),
    signOut: () => Promise.resolve(),
  },
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: { message: 'No Supabase configured' } }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
};

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : stubMethods;
