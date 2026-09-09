import { useQuery } from '@tanstack/react-query'
import { logService } from '../services/logService'

export const useAdminLogs = (limit: number) =>
  useQuery({
    queryKey: ['admin', 'logs', limit],
    queryFn: () => logService.getLogs(limit),
  })
