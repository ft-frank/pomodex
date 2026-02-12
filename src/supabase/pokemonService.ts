import { supabase } from './supabase'

async function getUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

export async function loadCollection(): Promise<{ caught: number[]; seen: number[] }> {
  const { data, error } = await supabase
    .from('pokemon_collection')
    .select('pokemon_id, is_caught, is_seen')

  if (error) {
    console.error('Failed to load collection', error)
    return { caught: [], seen: [] }
  }

  const caught = data.filter(r => r.is_caught).map(r => r.pokemon_id)
  const seen = data.filter(r => r.is_seen).map(r => r.pokemon_id)
  return { caught, seen }
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
}
