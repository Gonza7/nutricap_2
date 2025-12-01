// src/supabase.js
import { createClient } from '@supabase/supabase-js'

// Reemplaza estos valores con los de tu proyecto en Supabase
const supabaseUrl = 'https://cotczhxtqogjmcruytye.supabase.co'
const supabaseKey = 'sb_publishable_iUYw6d-npmEp2TFADNbRjg_n68X8fXx'

export const supabase = createClient(supabaseUrl, supabaseKey)