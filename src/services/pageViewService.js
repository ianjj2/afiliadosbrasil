import { supabase } from '../lib/supabase';

export const registerPageView = async () => {
  try {
    let ip_address = 'Não disponível';
    let location = null;

    try {
      // Tentar obter IP básico primeiro
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      ip_address = ipData.ip || 'Não disponível';

      // Tentar obter localização (opcional)
      try {
        const locationResponse = await fetch(`https://ipapi.co/${ip_address}/json/`);
        const locationData = await locationResponse.json();
        
        if (locationData && !locationData.error) {
          location = {
            city: locationData.city || 'Desconhecida',
            region: locationData.region || 'Desconhecido',
            country: locationData.country_name || 'Desconhecido'
          };
        }
      } catch (locError) {
        console.log('Não foi possível obter localização, continuando sem ela');
      }
    } catch (ipError) {
      console.log('Não foi possível obter IP, usando valor padrão');
    }

    // Registra a visualização mesmo sem IP completo
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
    // Não falha silenciosamente para não atrapalhar a experiência do usuário
    return false;
  }
}; 