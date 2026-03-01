import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kjfxctcornwtgalwemaq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqZnhjdGNvcm53dGdhbHdlbWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNjQzNzgsImV4cCI6MjA4Nzk0MDM3OH0.QkD4QaIjod27AlY2CO7VYZ-0iymqdUmXTlAxaId8PUc'

export const supabase = createClient(supabaseUrl, supabaseKey)
