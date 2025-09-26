import { supabase } from '../lib/supabase';

// Obtener todos los trofeos de una temporada
export const getTrophiesBySeason = async (seasonId) => {
  try {
    const { data, error } = await supabase
      .from('trophies')
      .select(`
        *,
        competition:competitions(name, nation:nations(name)),
        team:teams(name, nation:nations(name))
      `)
      .eq('season_id', seasonId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener trofeos de la temporada:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error en getTrophiesBySeason:', error);
    return [];
  }
};

// Crear nuevo trofeo
export const createTrophy = async (trophyData, seasonId) => {
  try {
    const { data, error } = await supabase
      .from('trophies')
      .insert([{
        season_id: seasonId,
        competition_id: trophyData.competition_id,
        team_id: trophyData.team_id,
        name: trophyData.name,
        is_individual: trophyData.is_individual || false
      }])
      .select(`
        *,
        competition:competitions(name, nation:nations(name)),
        team:teams(name, nation:nations(name))
      `)
      .single();

    if (error) {
      console.error('Error al crear trofeo:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error en createTrophy:', error);
    throw error;
  }
};

// Obtener todos los trofeos (para estadísticas generales)
export const getAllTrophies = async () => {
  try {
    const { data, error } = await supabase
      .from('trophies')
      .select(`
        *,
        season:seasons(name, year),
        competition:competitions(name, nation:nations(name)),
        team:teams(name, nation:nations(name))
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener todos los trofeos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error en getAllTrophies:', error);
    return [];
  }
};

// Eliminar trofeo
export const deleteTrophy = async (trophyId) => {
  try {
    const { error } = await supabase
      .from('trophies')
      .delete()
      .eq('id', trophyId);

    if (error) {
      console.error('Error al eliminar trofeo:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error en deleteTrophy:', error);
    throw error;
  }
};

// Obtener estadísticas de trofeos por temporada
export const getTrophyStatsBySeason = async (seasonId) => {
  try {
    const { data, error } = await supabase
      .from('trophies')
      .select('is_individual')
      .eq('season_id', seasonId);

    if (error) {
      console.error('Error al obtener estadísticas de trofeos:', error);
      return { total: 0, team: 0, individual: 0 };
    }

    const stats = data.reduce((acc, trophy) => {
      acc.total += 1;
      if (trophy.is_individual) {
        acc.individual += 1;
      } else {
        acc.team += 1;
      }
      return acc;
    }, { total: 0, team: 0, individual: 0 });

    return stats;
  } catch (error) {
    console.error('Error en getTrophyStatsBySeason:', error);
    return { total: 0, team: 0, individual: 0 };
  }
}; 