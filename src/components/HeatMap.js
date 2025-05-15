import React, { useEffect, useState, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat/dist/leaflet-heat.js';
import { getIpLocation } from '../services/ipService';

// Corrigir ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const HeatMap = ({ submissions }) => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState(null);
  const [heatLayer, setHeatLayer] = useState(null);
  const mapRef = useRef(null);

  // Buscar localizações dos IPs
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locations = await Promise.all(
          submissions.map(async (submission) => {
            try {
              const location = await getIpLocation(submission.ip_address);
              console.log('Location for IP', submission.ip_address, ':', location);
              return location ? [location.lat, location.lng, 1] : null;
            } catch (error) {
              console.error('Error fetching location for IP:', submission.ip_address, error);
              return null;
            }
          })
        );

        const validLocations = locations.filter(Boolean);
        console.log('Valid locations:', validLocations);
        setPoints(validLocations);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setLoading(false);
      }
    };

    if (submissions.length > 0) {
      fetchLocations();
    } else {
      setLoading(false);
    }
  }, [submissions]);

  // Inicializar mapa
  useEffect(() => {
    if (!mapRef.current || map) return;

    console.log('Initializing map...');
    const instance = L.map(mapRef.current, {
      center: [-14.235, -51.925], // Centro do Brasil
      zoom: 4,
      zoomControl: true,
      attributionControl: true,
      preferCanvas: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(instance);

    setMap(instance);

    return () => {
      if (heatLayer) {
        heatLayer.remove();
      }
      instance.remove();
    };
  }, [mapRef.current]);

  // Atualizar camada de calor
  useEffect(() => {
    if (!map || loading || !points.length) return;

    console.log('Updating heat layer with points:', points);

    // Remover camada de calor existente
    if (heatLayer) {
      heatLayer.remove();
    }

    // Criar nova camada de calor
    const newHeatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
      gradient: {
        0.4: '#00ff00',
        0.6: '#ffff00',
        0.8: '#ff0000'
      },
      minOpacity: 0.5
    }).addTo(map);

    setHeatLayer(newHeatLayer);

    // Ajustar visualização para incluir todos os pontos
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map(point => [point[0], point[1]]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, points, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-green-900/30 border border-green-800 rounded-lg">
        <div className="text-green-500">Carregando mapa de calor...</div>
      </div>
    );
  }

  return (
    <div className="bg-green-900/30 border border-green-800 rounded-lg overflow-hidden">
      <style>{`
        .leaflet-container {
          height: 400px;
          width: 100%;
          background: #1a2e1a !important;
        }
        .leaflet-tile-pane {
          filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
        }
        .leaflet-control-container .leaflet-control {
          background-color: rgba(0, 255, 0, 0.1) !important;
          border: 1px solid rgba(0, 255, 0, 0.2) !important;
          backdrop-filter: blur(10px);
        }
        .leaflet-control-container .leaflet-control a {
          color: #00ff00 !important;
        }
      `}</style>
      <div ref={mapRef} className="h-96 w-full" style={{ position: 'relative' }} />
    </div>
  );
};

export default HeatMap; 