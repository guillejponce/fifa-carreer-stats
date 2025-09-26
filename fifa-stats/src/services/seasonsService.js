import { supabase } from '../lib/supabase';

// Obtener todas las temporadas con información del club
export const getSeasons = async () => {
  try {
    const { data, error } = await supabase
      .from('seasons')
      .select(`
        *,
        club:teams!club_id(id,name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener temporadas:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error en getSeasons:', error);
    return [];
  }
};

// Crear una nueva temporada
export const createSeason = async (seasonData) => {
  try {
    const { data, error } = await supabase
      .from('seasons')
      .insert([
        { 
          name: seasonData.name, 
          club_id: seasonData.club_id,
          start_year: seasonData.start_year,
          end_year: seasonData.end_year
        }
      ])
      .select(`
        *,
        club:teams!club_id(id,name)
      `)
      .single();

    if (error) {
      console.error('Error al crear temporada:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error en createSeason:', error);
    throw error;
  }
};

// Obtener una temporada por ID con información del club
export const getSeasonById = async (seasonId) => {
  try {
    const { data, error } = await supabase
      .from('seasons')
      .select(`
        *,
        club:teams!club_id(id,name)
      `)
      .eq('id', seasonId)
      .single();

    if (error) {
      console.error('Error al obtener temporada:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error en getSeasonById:', error);
    return null;
  }
};

// Obtener estadísticas de carrera (resumen de todas las temporadas)
export const getCareerStats = async () => {
  try {
    // Obtener estadísticas agregadas de todos los partidos
    const { data: statsData, error: statsError } = await supabase
      .from('player_stats')
      .select(`
        goals,
        assists,
        rating,
        minutes_played,
        matches!inner(*)
      `);

    if (statsError) {
      console.error('Error al obtener estadísticas:', statsError);
      return {
        totalMatches: 0,
        totalGoals: 0,
        totalAssists: 0,
        averageRating: 0,
        totalSeasons: 0
      };
    }

    // Obtener número de temporadas
    const { data: seasonsData, error: seasonsError } = await supabase
      .from('seasons')
      .select('id');

    if (seasonsError) {
      console.error('Error al obtener temporadas:', seasonsError);
    }

    // Calcular estadísticas
    const totalMatches = statsData.length;
    const totalGoals = statsData.reduce((sum, stat) => sum + (stat.goals || 0), 0);
    const totalAssists = statsData.reduce((sum, stat) => sum + (stat.assists || 0), 0);
    const totalRating = statsData.reduce((sum, stat) => sum + (stat.rating || 0), 0);
    const averageRating = totalMatches > 0 ? totalRating / totalMatches : 0;
    const totalSeasons = seasonsData ? seasonsData.length : 0;

    return {
      totalMatches,
      totalGoals,
      totalAssists,
      averageRating,
      totalSeasons
    };
  } catch (error) {
    console.error('Error en getCareerStats:', error);
    return {
      totalMatches: 0,
      totalGoals: 0,
      totalAssists: 0,
      averageRating: 0,
      totalSeasons: 0
    };
  }
}; 