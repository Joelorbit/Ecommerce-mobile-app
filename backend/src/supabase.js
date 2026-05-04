require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const isValidUrl = supabaseUrl && supabaseUrl.startsWith('http');

if (!isValidUrl || !supabaseServiceKey) {
  console.warn('⚠️  Supabase env vars not set or invalid — running in MOCK mode');
}

const supabase = isValidUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

module.exports = { supabase };
