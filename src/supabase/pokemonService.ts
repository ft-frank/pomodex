import { supabase } from './supabase'

async function getUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

export async function loadCollection(): Promise<{ caught: number[]; seen: number[]; caughtCounts: Record<number, number> }> {
  const { data, error } = await supabase
    .from('pokemon_collection')
    .select('pokemon_id, is_caught, is_seen, number_caught')

  if (error) {
    console.error('Failed to load collection', error)
    return { caught: [], seen: [], caughtCounts: {} }
  }

  const caught = data.filter(r => r.is_caught).map(r => r.pokemon_id)
  const seen = data.filter(r => r.is_seen).map(r => r.pokemon_id)
  const caughtCounts: Record<number, number> = {}
  data.filter(r => r.is_caught).forEach(r => {
    caughtCounts[r.pokemon_id] = r.number_caught
  })
  return { caught, seen, caughtCounts }
}

export async function markSeen(pokemonId: number): Promise<void> {
  const userId = await getUserId()
  if (!userId) return

  const { error } = await supabase
    .from('pokemon_collection')
    .upsert(
      { user_id: userId, pokemon_id: pokemonId, is_seen: true, seen_at: new Date().toISOString() },
      { onConflict: 'user_id,pokemon_id', ignoreDuplicates: true }
    )
  if (error) console.error('Failed to mark seen', error)
}

export async function markCaught(pokemonId: number): Promise<void> {
  const userId = await getUserId()
  if (!userId) return

  const { error } = await supabase
    .from('pokemon_collection')
    .upsert(
      { user_id: userId, pokemon_id: pokemonId, is_caught: true, is_seen: true, caught_at: new Date().toISOString() },
      { onConflict: 'user_id,pokemon_id' }
    )
  if (error) console.error('Failed to mark caught', error)

  const { error: rpcError } = await supabase.rpc('increment_caught', { p_user_id: userId, p_pokemon_id: pokemonId })
  if (rpcError) console.error('Failed to increment caught count', rpcError)
}

export async function loadStats(): Promise<{ total_session_time: number; total_sessions: number; total_attempts: number }> {
  const userId = await getUserId()
  if (!userId) return { total_session_time: 0, total_sessions: 0, total_attempts: 0}

  const { data, error } = await supabase
    .from('user_stats')
    .select('total_session_time, total_sessions, total_attempts')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Failed to load stats', error)
    return { total_session_time: 0, total_sessions: 0, total_attempts: 0 }
  }

  return { total_session_time: data.total_session_time ?? 0, total_sessions: data.total_sessions ?? 0, total_attempts: data.total_attempts ?? 0 }
}

export async function updateSessionStats(sessionMinutes: number): Promise<void> {
  const userId = await getUserId()
  if (!userId) return

  const { error } = await supabase.rpc('update_session_stats', { p_user_id: userId, p_session_time: sessionMinutes })
  if (error) console.error('Failed to update session stats', error)
}

export async function incrementTotalSessions(): Promise<void> {
  const userId = await getUserId()
  if (!userId) return

  const { error } = await supabase.rpc('increment_total_sessions', { p_user_id: userId })
  if (error) console.error('Failed to increment total sessions', error)
}
