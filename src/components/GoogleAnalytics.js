import { useEffect } from 'react';

const GoogleAnalytics = () => {
  useEffect(() => {
    // Carrega o script do Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-16613143963';
    document.head.appendChild(script);

    // Inicializa o gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'AW-16613143963');

    // Adiciona o gtag como função global
    window.gtag = gtag;

    return () => {
      // Cleanup
      document.head.removeChild(script);
    };
  }, []);

  return null;
};

// Função para disparar evento de conversão
export const trackGoogleConversion = () => {
  if (window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-11551276440/JHEdCL6g184aEJj7iYQr',
      'value': 1.0,
      'currency': 'BRL'
    });
    console.log('Evento de conversão disparado para o Google Analytics');
  } else {
    console.warn('Google Analytics não está carregado');
  }
};

export default GoogleAnalytics; 
