import { supabase } from '../lib/supabase';
import { findOrCreateNation } from './nationsService';

// Obtener todos los equipos/clubes
export const getTeams = async () => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        nation:nations!nation_id(name)
      `)
      .limit(10000) // Aumentar el límite para traer todos los equipos
      .order('name');

    if (error) {
      console.error('Error al obtener equipos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error en getTeams:', error);
    return [];
  }
};

// Obtener solo clubes (no selecciones nacionales)
export const getClubs = async () => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        nation:nations!nation_id(name)
      `)
      .eq('is_national_team', false)
      .limit(10000) // Aumentar el límite también aquí
      .order('name');

    if (error) {
      console.error('Error al obtener clubes:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error en getClubs:', error);
    return [];
  }
};

// Obtener un equipo por ID
export const getTeamById = async (teamId) => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        nation:nations!nation_id(name)
      `)
      .eq('id', teamId)
      .single();

    if (error) {
      console.error('Error al obtener equipo:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error en getTeamById:', error);
    return null;
  }
};

// Crear un nuevo equipo/club
export const createTeam = async (teamData) => {
  try {
    // Si no se proporciona nation_id pero sí un nombre de nación, buscarla o crearla
    let nation_id = teamData.nation_id;
    
    if (!nation_id && teamData.nation_name) {
      const nation = await findOrCreateNation(teamData.nation_name);
      nation_id = nation.id;
    }

    // Si no hay nation_id y es para España por defecto (puedes cambiar esto)
    /*
    if (!nation_id) {
      const nation = await findOrCreateNation('España');
      nation_id = nation.id;
    }
    */

    const { data, error } = await supabase
      .from('teams')
      .insert([{
        name: teamData.name,
        is_national_team: teamData.is_national_team || false,
        nation_id: nation_id
      }])
      .select(`
        *,
        nation:nations!nation_id(name)
      `)
      .single();

    if (error) {
      console.error('Error al crear equipo:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error en createTeam:', error);
    throw error;
  }
};

// Buscar o crear un equipo por nombre
export const findOrCreateTeam = async (teamName, isNationalTeam = false, nationName = 'España') => {
  try {
    // Primero intentar encontrar el equipo
    const { data: existingTeam, error: findError } = await supabase
      .from('teams')
      .select(`
        *,
        nation:nations!nation_id(name)
      `)
      .eq('name', teamName)
      .eq('is_national_team', isNationalTeam)
      .single();

    if (findError && findError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error al buscar equipo:', findError);
      return null;
    }

    if (existingTeam) {
      return existingTeam;
    }

    // Si no existe, crear uno nuevo
    return await createTeam({
      name: teamName,
      is_national_team: isNationalTeam,
      nation_name: nationName
    });
  } catch (error) {
    console.error('Error en findOrCreateTeam:', error);
    return null;
  }
}; 