export interface ServerLog {
  id: string
  error_message: string
  stack: string | null
  context: Record<string, unknown> | null
  user_id: string | null
  created_at: string
}
