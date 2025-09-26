import { supabase } from '../lib/supabase';

// Obtener todas las naciones
export const getNations = async () => {
  try {
    const { data, error } = await supabase
      .from('nations')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error al obtener naciones:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error en getNations:', error);
    return [];
  }
};

// Crear nueva nación
export const createNation = async (name) => {
  try {
    const { data, error } = await supabase
      .from('nations')
      .insert([{ name }])
      .select()
      .single();

    if (error) {
      console.error('Error al crear nación:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error en createNation:', error);
    throw error;
  }
};

// Buscar nación por nombre
export const findNationByName = async (name) => {
  try {
    const { data, error } = await supabase
      .from('nations')
      .select('*')
      .eq('name', name)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error al buscar nación:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error en findNationByName:', error);
    return null;
  }
};

// Buscar o crear nación
export const findOrCreateNation = async (name) => {
  try {
    // Primero intentar encontrar la nación
    let nation = await findNationByName(name);
    
    if (nation) {
      return nation;
    }

    // Si no existe, crear una nueva
    return await createNation(name);
  } catch (error) {
    console.error('Error en findOrCreateNation:', error);
    throw error;
  }
}; 