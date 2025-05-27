import React, { useEffect } from 'react';

// Declaração global do fbq para o ESLint
/* global fbq */

const FacebookPixel = () => {
  useEffect(() => {
    // Carrega o script do Facebook Pixel
    const loadFacebookPixel = () => {
      const script = document.createElement('script');
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${process.env.REACT_APP_FACEBOOK_PIXEL_ID}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
    };

    loadFacebookPixel();
  }, []);

  return null;
};

export default FacebookPixel; 
