import { supabase } from '../lib/supabase';
import { findOrCreateNation } from './nationsService';

// Obtener todas las competiciones
export const getCompetitions = async () => {
  try {
    const { data, error } = await supabase
      .from('competitions')
      .select(`
        *,
        nation:nations!nation_id(name)
      `)
      .order('name');

    if (error) {
      console.error('Error al obtener competiciones:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error en getCompetitions:', error);
    return [];
  }
};

// Crear nueva competición
export const createCompetition = async (competitionData) => {
  try {
    // Si se proporciona un nombre de nación, buscarla o crearla
    let nation_id = competitionData.nation_id;
    
    if (!nation_id && competitionData.nation_name) {
      const nation = await findOrCreateNation(competitionData.nation_name);
      nation_id = nation.id;
    }

    const { data, error } = await supabase
      .from('competitions')
      .insert([{
        name: competitionData.name,
        type: competitionData.type,
        level: competitionData.level,
        nation_id: nation_id // Puede ser null para competiciones internacionales
      }])
      .select(`
        *,
        nation:nations(name)
      `)
      .single();

    if (error) {
      console.error('Error al crear competición:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error en createCompetition:', error);
    throw error;
  }
};

// Buscar competición por nombre (para evitar duplicados)
export const findCompetitionByName = async (name) => {
  try {
    const { data, error } = await supabase
      .from('competitions')
      .select(`
        *,
        nation:nations(name)
      `)
      .eq('name', name)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error al buscar competición:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error en findCompetitionByName:', error);
    return null;
  }
};

// Obtener competiciones por tipo
export const getCompetitionsByType = async (type) => {
  try {
    const { data, error } = await supabase
      .from('competitions')
      .select(`
        *,
        nation:nations(name)
      `)
      .eq('type', type)
      .order('name');

    if (error) {
      console.error('Error al obtener competiciones por tipo:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error en getCompetitionsByType:', error);
    return [];
  }
};

// Obtener competiciones por nivel (club o selección)
export const getCompetitionsByLevel = async (level) => {
  try {
    const { data, error } = await supabase
      .from('competitions')
      .select(`
        *,
        nation:nations(name)
      `)
      .eq('level', level)
      .order('name');

    if (error) {
      console.error('Error al obtener competiciones por nivel:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error en getCompetitionsByLevel:', error);
    return [];
  }
}; 