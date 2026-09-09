import { supabase } from '@/lib/supabase'
import type { ServerLog } from '../types'

export const logService = {
  getLogs: async (limit: number): Promise<ServerLog[]> => {
    const { data, error } = await supabase
      .from('server_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as ServerLog[]
  },
}
