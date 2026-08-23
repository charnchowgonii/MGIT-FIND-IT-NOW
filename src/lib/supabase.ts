// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dzcoxdmvkmjznvvkrecr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6Y294ZG12a21qem52dmtyZWNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NDM3ODIsImV4cCI6MjA2NDAxOTc4Mn0.ychCvTYxNRJ6U5qAHOTkQCBIS6K1YVo2G6We2goDaog'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
