import { supabase } from '../lib/supabase';

// Obtener estadísticas detalladas de carrera
export const getDetailedCareerStats = async () => {
  try {
    // Obtener todas las estadísticas con información completa
    const { data: allStats, error } = await supabase
      .from('player_stats')
      .select(`
        goals,
        assists,
        rating,
        minutes_played,
        yellow_cards,
        red_cards,
        team_id,
        player_team:teams!player_stats_team_id_fkey(is_national_team),
        matches!inner(
          id,
          season_id,
          date,
          home_team_id,
          away_team_id,
          home_score,
          away_score,
          is_home_match,
          home_team:teams!matches_home_team_id_fkey(name),
          away_team:teams!matches_away_team_id_fkey(name),
          competition:competitions(name, type),
          season:seasons(name, club:teams(name))
        )
      `);

    if (error) {
      console.error('Error al obtener estadísticas detalladas:', error);
      return getEmptyStats();
    }

    return calculateDetailedStats(allStats);
  } catch (error) {
    console.error('Error en getDetailedCareerStats:', error);
    return getEmptyStats();
  }
};

// Calcular estadísticas detalladas
const calculateDetailedStats = (statsData) => {
  // Estadísticas generales
  const totalMatches = statsData.length;
  const totalGoals = statsData.reduce((sum, stat) => sum + (stat.goals || 0), 0);
  const totalAssists = statsData.reduce((sum, stat) => sum + (stat.assists || 0), 0);
  const totalMinutes = statsData.reduce((sum, stat) => sum + (stat.minutes_played || 0), 0);
  const totalRating = statsData.reduce((sum, stat) => sum + (stat.rating || 0), 0);
  const averageRating = totalMatches > 0 ? totalRating / totalMatches : 0;
  const totalYellowCards = statsData.reduce((sum, stat) => sum + (stat.yellow_cards || 0), 0);
  const totalRedCards = statsData.reduce((sum, stat) => sum + (stat.red_cards || 0), 0);

  // Calcular partidos ganados, empatados y perdidos
  const matchResults = calculateMatchResults(statsData);

  // Separar por club vs selección
  const clubMatches = statsData.filter(stat => !stat.player_team?.is_national_team);
  const nationalMatches = statsData.filter(stat => stat.player_team?.is_national_team);

  const clubStats = calculateBasicStats(clubMatches);
  const nationalStats = calculateBasicStats(nationalMatches);

  // Top equipos rivales (más goles marcados)
  const opponentGoals = {};
  statsData.forEach(stat => {
    const match = stat.matches;
    const opponent = match.is_home_match ? match.away_team?.name : match.home_team?.name;
    if (opponent && stat.goals > 0) {
      opponentGoals[opponent] = (opponentGoals[opponent] || 0) + stat.goals;
    }
  });

  const topOpponents = Object.entries(opponentGoals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([team, goals]) => ({ team, goals }));

  // Estadísticas por competición
  const competitionStats = {};
  statsData.forEach(stat => {
    const competition = stat.matches.competition?.name || 'Sin especificar';
    if (!competitionStats[competition]) {
      competitionStats[competition] = {
        matches: 0,
        goals: 0,
        assists: 0,
        rating: 0,
        minutes: 0
      };
    }
    competitionStats[competition].matches++;
    competitionStats[competition].goals += stat.goals || 0;
    competitionStats[competition].assists += stat.assists || 0;
    competitionStats[competition].rating += stat.rating || 0;
    competitionStats[competition].minutes += stat.minutes_played || 0;
  });

  // Calcular promedios para competiciones
  Object.keys(competitionStats).forEach(comp => {
    const stats = competitionStats[comp];
    stats.averageRating = stats.matches > 0 ? stats.rating / stats.matches : 0;
  });

  const topCompetitions = Object.entries(competitionStats)
    .sort(([,a], [,b]) => b.goals - a.goals)
    .slice(0, 5)
    .map(([name, stats]) => ({ name, ...stats }));

  // Mejores partidos (por rating)
  const bestMatches = statsData
    .filter(stat => stat.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5)
    .map(stat => ({
      date: stat.matches.date,
      opponent: stat.matches.is_home_match ? stat.matches.away_team?.name : stat.matches.home_team?.name,
      competition: stat.matches.competition?.name,
      rating: stat.rating,
      goals: stat.goals,
      assists: stat.assists,
      result: `${stat.matches.home_score}-${stat.matches.away_score}`
    }));

  // Estadísticas por temporada
  const seasonStats = {};
  statsData.forEach(stat => {
    const seasonName = stat.matches.season?.name || 'Sin especificar';
    const clubName = stat.matches.season?.club?.name || 'Sin club';
    const key = `${seasonName} (${clubName})`;
    
    if (!seasonStats[key]) {
      seasonStats[key] = {
        matches: 0,
        goals: 0,
        assists: 0,
        rating: 0,
        minutes: 0,
        wins: 0,
        draws: 0,
        losses: 0
      };
    }
    
    seasonStats[key].matches++;
    seasonStats[key].goals += stat.goals || 0;
    seasonStats[key].assists += stat.assists || 0;
    seasonStats[key].rating += stat.rating || 0;
    seasonStats[key].minutes += stat.minutes_played || 0;
  });

  // Calcular resultados por temporada
  Object.keys(seasonStats).forEach(key => {
    const seasonData = statsData.filter(stat => {
      const seasonName = stat.matches.season?.name || 'Sin especificar';
      const clubName = stat.matches.season?.club?.name || 'Sin club';
      return `${seasonName} (${clubName})` === key;
    });
    
    const seasonResults = calculateMatchResults(seasonData).general;
    seasonStats[key].wins = seasonResults.wins;
    seasonStats[key].draws = seasonResults.draws;
    seasonStats[key].losses = seasonResults.losses;
  });

  Object.keys(seasonStats).forEach(season => {
    const stats = seasonStats[season];
    stats.averageRating = stats.matches > 0 ? stats.rating / stats.matches : 0;
    stats.averageMinutes = stats.matches > 0 ? stats.minutes / stats.matches : 0;
    stats.goalsPerMatch = stats.matches > 0 ? stats.goals / stats.matches : 0;
    stats.assistsPerMatch = stats.matches > 0 ? stats.assists / stats.matches : 0;
    stats.goalsAssistsPerMatch = stats.matches > 0 ? (stats.goals + stats.assists) / stats.matches : 0;
  });

  return {
    general: {
      totalMatches,
      totalGoals,
      totalAssists,
      totalMinutes,
      averageRating,
      totalYellowCards,
      totalRedCards,
      goalsPerMatch: totalMatches > 0 ? totalGoals / totalMatches : 0,
      assistsPerMatch: totalMatches > 0 ? totalAssists / totalMatches : 0,
      goalsAssistsPerMatch: totalMatches > 0 ? (totalGoals + totalAssists) / totalMatches : 0,
      ...matchResults.general
    },
    club: {
      ...clubStats,
      ...matchResults.club
    },
    national: {
      ...nationalStats,
      ...matchResults.national
    },
    topOpponents,
    topCompetitions,
    bestMatches,
    seasonStats: Object.entries(seasonStats).map(([name, stats]) => ({ name, ...stats }))
  };
};

// Nueva función para calcular resultados de partidos
const calculateMatchResults = (statsData) => {
  const calculateResults = (matches) => {
    let wins = 0, draws = 0, losses = 0;
    
    matches.forEach((stat) => {
      const match = stat.matches;
      const homeScore = match.home_score;
      const awayScore = match.away_score;
      
      if (homeScore === undefined || awayScore === undefined) {
        return;
      }
      
      const playerIsHome = stat.team_id 
        ? stat.team_id === match.home_team_id 
        : match.is_home_match;

      const isDraw = homeScore === awayScore;
      const playerWon = !isDraw && (
        (playerIsHome && homeScore > awayScore) ||
        (!playerIsHome && awayScore > homeScore)
      );
      
      if (isDraw) {
        draws++;
      } else if (playerWon) {
        wins++;
      } else {
        losses++;
      }
    });
    
    return { wins, draws, losses };
  };
  
  const generalResults = calculateResults(statsData);
  const clubResults = calculateResults(statsData.filter(stat => !stat.player_team?.is_national_team));
  const nationalResults = calculateResults(statsData.filter(stat => stat.player_team?.is_national_team));
  
  return {
    general: generalResults,
    club: clubResults,
    national: nationalResults
  };
};

// Calcular estadísticas básicas para un conjunto de datos
const calculateBasicStats = (statsData) => {
  const matches = statsData.length;
  const goals = statsData.reduce((sum, stat) => sum + (stat.goals || 0), 0);
  const assists = statsData.reduce((sum, stat) => sum + (stat.assists || 0), 0);
  const minutes = statsData.reduce((sum, stat) => sum + (stat.minutes_played || 0), 0);
  const rating = statsData.reduce((sum, stat) => sum + (stat.rating || 0), 0);
  const yellowCards = statsData.reduce((sum, stat) => sum + (stat.yellow_cards || 0), 0);
  const redCards = statsData.reduce((sum, stat) => sum + (stat.red_cards || 0), 0);

  return {
    matches,
    goals,
    assists,
    minutes,
    averageRating: matches > 0 ? rating / matches : 0,
    yellowCards,
    redCards,
    goalsPerMatch: matches > 0 ? goals / matches : 0,
    assistsPerMatch: matches > 0 ? assists / matches : 0,
    goalsAssistsPerMatch: matches > 0 ? (goals + assists) / matches : 0
  };
};

// Retornar estadísticas vacías en caso de error
const getEmptyStats = () => ({
  general: {
    totalMatches: 0,
    totalGoals: 0,
    totalAssists: 0,
    totalMinutes: 0,
    averageRating: 0,
    totalYellowCards: 0,
    totalRedCards: 0,
    goalsPerMatch: 0,
    assistsPerMatch: 0,
    goalsAssistsPerMatch: 0,
    wins: 0,
    draws: 0,
    losses: 0
  },
  club: {
    matches: 0,
    goals: 0,
    assists: 0,
    minutes: 0,
    averageRating: 0,
    yellowCards: 0,
    redCards: 0,
    goalsPerMatch: 0,
    assistsPerMatch: 0,
    goalsAssistsPerMatch: 0,
    wins: 0,
    draws: 0,
    losses: 0
  },
  national: {
    matches: 0,
    goals: 0,
    assists: 0,
    minutes: 0,
    averageRating: 0,
    yellowCards: 0,
    redCards: 0,
    goalsPerMatch: 0,
    assistsPerMatch: 0,
    goalsAssistsPerMatch: 0,
    wins: 0,
    draws: 0,
    losses: 0
  },
  topOpponents: [],
  topCompetitions: [],
  bestMatches: [],
  seasonStats: []
}); 