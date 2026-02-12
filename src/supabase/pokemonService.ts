import { supabase } from './supabase'

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
  const { error } = await supabase
    .from('pokemon_collection')
    .upsert(
      { pokemon_id: pokemonId, is_seen: true, seen_at: new Date().toISOString() },
      { onConflict: 'pokemon_id', ignoreDuplicates: true }
    )
  if (error) console.error('Failed to mark seen', error)
}

export async function markCaught(pokemonId: number): Promise<void> {
  const { error } = await supabase
    .from('pokemon_collection')
    .upsert(
      { pokemon_id: pokemonId, is_caught: true, is_seen: true, caught_at: new Date().toISOString() },
      { onConflict: 'pokemon_id' }
    )
  if (error) console.error('Failed to mark caught', error)
}
