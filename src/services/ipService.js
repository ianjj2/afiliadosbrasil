import axios from 'axios';

const cache = new Map();

export const getIpLocation = async (ip) => {
  if (!ip || ip === 'IP não disponível') {
    console.log('IP inválido ou não disponível:', ip);
    return null;
  }

  // Remover possíveis caracteres inválidos do IP
  const cleanIp = ip.trim().replace(/[^0-9.]/g, '');

  if (cache.has(cleanIp)) {
    console.log('Usando cache para IP:', cleanIp);
    return cache.get(cleanIp);
  }

  try {
    // Usando a API do ip-api.com que é mais confiável e não requer chave
    console.log('Buscando localização para IP:', cleanIp);
    const response = await axios.get(`http://ip-api.com/json/${cleanIp}?fields=status,message,country,regionName,city,lat,lon`);

    if (response.data.status === 'success') {
      const location = {
        lat: response.data.lat,
        lng: response.data.lon,
        city: response.data.city || 'Cidade desconhecida',
        region: response.data.regionName || 'Região desconhecida',
        country: response.data.country || 'País desconhecido'
      };

      console.log('Localização encontrada:', location);
      cache.set(cleanIp, location);
      return location;
    } else {
      console.error('Erro na resposta da API:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar localização do IP:', error.message);
    
    // Tentar API alternativa
    try {
      const fallbackResponse = await axios.get(`https://ipapi.co/${cleanIp}/json/`);
      
      if (!fallbackResponse.data.error) {
        const location = {
          lat: fallbackResponse.data.latitude,
          lng: fallbackResponse.data.longitude,
          city: fallbackResponse.data.city || 'Cidade desconhecida',
          region: fallbackResponse.data.region || 'Região desconhecida',
          country: fallbackResponse.data.country_name || 'País desconhecido'
        };

        console.log('Localização encontrada (fallback):', location);
        cache.set(cleanIp, location);
        return location;
      }
    } catch (fallbackError) {
      console.error('Erro na API alternativa:', fallbackError.message);
    }
    
    return null;
  }
}; 