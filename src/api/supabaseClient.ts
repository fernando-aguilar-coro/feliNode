import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = 'https://tkandopbazibmvohvckm.supabase.co'
const supabaseAnonKey = 'sb_publishable_nNhqL12jNHuvn-oVWsSwnQ_rutMuskS'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})