import { supabase } from '../lib/supabase';

// Obtener partidos de una temporada con estadísticas del jugador
export const getMatchesBySeason = async (seasonId) => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        player_stats(*),
        home_team:teams!matches_home_team_id_fkey(id,name),
        away_team:teams!matches_away_team_id_fkey(id,name),
        competition:competitions(id,name)
      `)
      .eq('season_id', seasonId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error al obtener partidos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error en getMatchesBySeason:', error);
    return [];
  }
};

// Crear un nuevo partido con estadísticas del jugador
export const createMatch = async (seasonId, matchData, playerStats) => {
  try {
    console.log('Creating match with data:', matchData);
    console.log('Player stats:', playerStats);
    console.log('Season ID:', seasonId);

    // Crear el partido directamente con los IDs proporcionados
    const { data: matchResult, error: matchError } = await supabase
      .from('matches')
      .insert([{
        season_id: seasonId,
        competition_id: matchData.competition_id,
        date: new Date(matchData.match_date).toISOString(),
        home_team_id: matchData.is_home_match ? matchData.team_id : matchData.opponent_team_id,
        away_team_id: matchData.is_home_match ? matchData.opponent_team_id : matchData.team_id,
        team_id: matchData.team_id,
        opponent_team_id: matchData.opponent_team_id,
        match_date: matchData.match_date,
        is_home_match: matchData.is_home_match,
        home_score: matchData.home_score,
        away_score: matchData.away_score,
        is_completed: true
      }])
      .select();

    if (matchError) {
      console.error('Error al crear partido - detalles:', matchError);
      console.error('Datos del partido que causaron el error:', {
        season_id: seasonId,
        date: matchData.date,
        competition_id: matchData.competition_id,
        home_team_id: matchData.home_team_id,
        away_team_id: matchData.away_team_id,
        is_home: matchData.is_home,
        is_national_team: matchData.is_national_team,
        result: matchData.result
      });
      throw matchError;
    }

    const match = matchResult[0];
    console.log('Match created successfully:', match);

    // Crear las estadísticas del jugador para ese partido
    const { data: statsResult, error: statsError } = await supabase
      .from('player_stats')
      .insert([{
        match_id: match.id,
        goals: playerStats.goals,
        assists: playerStats.assists,
        yellow_cards: playerStats.yellow_cards || 0,
        red_cards: playerStats.red_cards || 0,
        rating: playerStats.rating,
        minutes_played: playerStats.minutes_played
      }])
      .select();

    if (statsError) {
      console.error('Error al crear estadísticas - detalles:', statsError);
      console.error('Datos de estadísticas que causaron el error:', {
        match_id: match.id,
        goals: playerStats.goals,
        assists: playerStats.assists,
        yellow_cards: playerStats.yellow_cards,
        red_cards: playerStats.red_cards,
        rating: playerStats.rating,
        minutes_played: playerStats.minutes_played
      });
      throw statsError;
    }

    console.log('Player stats created successfully:', statsResult[0]);
    return match;
  } catch (error) {
    console.error('Error en createMatch:', error);
    throw error;
  }
};

// Obtener estadísticas de una temporada específica
export const getSeasonStats = async (seasonId) => {
  try {
    const { data, error } = await supabase
      .from('player_stats')
      .select(`
        goals,
        assists,
        rating,
        minutes_played,
        yellow_cards,
        red_cards,
        matches!inner(season_id)
      `)
      .eq('matches.season_id', seasonId);

    if (error) {
      console.error('Error al obtener estadísticas de temporada:', error);
      return {
        totalMatches: 0,
        totalGoals: 0,
        totalAssists: 0,
        totalMinutes: 0,
        averageRating: 0,
        yellowCards: 0,
        redCards: 0
      };
    }

    // Calcular estadísticas
    const totalMatches = data.length;
    const totalGoals = data.reduce((sum, stat) => sum + (stat.goals || 0), 0);
    const totalAssists = data.reduce((sum, stat) => sum + (stat.assists || 0), 0);
    const totalMinutes = data.reduce((sum, stat) => sum + (stat.minutes_played || 0), 0);
    const totalRating = data.reduce((sum, stat) => sum + (stat.rating || 0), 0);
    const yellowCards = data.reduce((sum, stat) => sum + (stat.yellow_cards || 0), 0);
    const redCards = data.reduce((sum, stat) => sum + (stat.red_cards || 0), 0);

    return {
      totalMatches,
      totalGoals,
      totalAssists,
      totalMinutes,
      averageRating: totalMatches > 0 ? totalRating / totalMatches : 0,
      yellowCards,
      redCards
    };
  } catch (error) {
    console.error('Error en getSeasonStats:', error);
    return {
      totalMatches: 0,
      totalGoals: 0,
      totalAssists: 0,
      totalMinutes: 0,
      averageRating: 0,
      yellowCards: 0,
      redCards: 0
    };
  }
};

// Eliminar un partido y sus estadísticas
export const deleteMatch = async (matchId) => {
  try {
    // Primero eliminar las estadísticas del jugador
    const { error: statsError } = await supabase
      .from('player_stats')
      .delete()
      .eq('match_id', matchId);

    if (statsError) {
      console.error('Error al eliminar estadísticas:', statsError);
      throw statsError;
    }

    // Luego eliminar el partido
    const { error: matchError } = await supabase
      .from('matches')
      .delete()
      .eq('id', matchId);

    if (matchError) {
      console.error('Error al eliminar partido:', matchError);
      throw matchError;
    }

    return true;
  } catch (error) {
    console.error('Error en deleteMatch:', error);
    throw error;
  }
}; 