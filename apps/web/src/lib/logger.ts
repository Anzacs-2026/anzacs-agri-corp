import { supabase } from './supabase'

interface LogErrorInput {
  errorMessage: string
  stack?: string
  context?: Record<string, unknown>
  userId?: string
}

export async function logError({ errorMessage, stack, context, userId }: LogErrorInput): Promise<void> {
  const { error } = await supabase.from('server_logs').insert({
    error_message: errorMessage,
    stack: stack ?? null,
    context: context ?? null,
    user_id: userId ?? null,
  })

  if (error) {
    // Last-resort fallback — server_logs insert itself failed
    console.error('logError failed to write to server_logs', error, { errorMessage, context })
  }
}
