import { supabase } from '../lib/supabase';

export const registerPageView = async () => {
  try {
    // Usar ipapi.co que é mais confiável
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (!data.ip) {
      throw new Error('IP não encontrado');
    }

    const ip_address = data.ip;
    const location = {
      city: data.city || 'Desconhecida',
      region: data.region || 'Desconhecido',
      country: data.country_name || 'Desconhecido'
    };

    // Registra todas as visualizações
    const { error } = await supabase
      .from('page_views')
      .insert([
        { 
          ip_address,
          location,
          timestamp: new Date().toISOString()
        }
      ]);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Erro ao registrar visualização:', error);
    return false;
  }
}; 