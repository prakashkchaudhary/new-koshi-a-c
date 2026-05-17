import React, { useEffect, useRef, useMemo } from 'react';

const RouteMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Nepal city coordinates
  const cities = useMemo(() => ({
    kathmandu: { lat: 27.7172, lng: 85.3240, name: 'Kathmandu' },
    dharan: { lat: 26.8149, lng: 87.2824, name: 'Dharan' },
    delhi: { lat: 28.6139, lng: 77.2090, name: 'New Delhi' },
    sunsari: { lat: 26.6270, lng: 87.1750, name: 'Sunsari' }
  }), []);

  // Bus routes
  const routes = useMemo(() => [
    { from: cities.dharan, to: cities.kathmandu, color: '#3B82F6', name: 'Dharan → Kathmandu', type: 'Night Service' },
    { from: cities.kathmandu, to: cities.dharan, color: '#8B5CF6', name: 'Kathmandu → Dharan', type: 'Night Service' },
    { from: cities.kathmandu, to: cities.delhi, color: '#10B981', name: 'Kathmandu → Delhi', type: 'International' },
  ], [cities]);

  useEffect(() => {
    // Only load if Leaflet is available
    if (!window.L || mapInstanceRef.current) return;

    const L = window.L;

    // Initialize map centered on Nepal
    const map = L.map(mapRef.current, {
      center: [27.7, 85.3],
      zoom: 7,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Custom marker icon
    const busIcon = L.divIcon({
      className: 'custom-bus-marker',
      html: `<div style="
        background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        border: 3px solid white;
      ">🚌</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    // Add city markers
    Object.values(cities).forEach(city => {
      const marker = L.marker([city.lat, city.lng], { icon: busIcon }).addTo(map);
      marker.bindPopup(`
        <div style="text-align: center; font-family: 'Poppins', sans-serif;">
          <strong style="font-size: 14px; color: #1F2937;">${city.name}</strong>
          <p style="font-size: 11px; color: #6B7280; margin: 4px 0 0 0;">Bus Terminal</p>
        </div>
      `);
    });

    // Add route lines with animation
    routes.forEach((route, index) => {
      // Create curved path
      const latlngs = [
        [route.from.lat, route.from.lng],
        [route.to.lat, route.to.lng]
      ];

      // Draw route line
      const polyline = L.polyline(latlngs, {
        color: route.color,
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10',
        className: 'route-line'
      }).addTo(map);

      // Add route label
      const midLat = (route.from.lat + route.to.lat) / 2;
      const midLng = (route.from.lng + route.to.lng) / 2;

      L.marker([midLat, midLng], {
        icon: L.divIcon({
          className: 'route-label',
          html: `<div style="
            background: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            color: ${route.color};
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            white-space: nowrap;
            border: 2px solid ${route.color};
          ">${route.name}</div>`,
          iconSize: [0, 0],
        })
      }).addTo(map);

      // Bind popup to route line
      polyline.bindPopup(`
        <div style="font-family: 'Poppins', sans-serif;">
          <strong style="color: ${route.color};">${route.name}</strong>
          <p style="font-size: 12px; color: #6B7280; margin: 4px 0 0 0;">${route.type}</p>
        </div>
      `);
    });

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [cities, routes]);

  return (
    <div className="relative">
      {/* Map container */}
      <div 
        ref={mapRef} 
        className="w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
        style={{ zIndex: 1 }}
      />
      
      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200 z-10">
        <h4 className="text-sm font-bold text-gray-900 mb-3">🗺️ Our Routes</h4>
        <div className="space-y-2">
          {routes.map((route, i) => (
            <div key={i} className="flex items-center gap-2">
              <div 
                className="w-8 h-1 rounded-full" 
                style={{ 
                  background: route.color,
                  boxShadow: `0 0 8px ${route.color}40`
                }}
              />
              <span className="text-xs text-gray-600 font-medium">{route.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-xs">
              🚌
            </div>
            <span className="text-xs text-gray-500">Bus Terminal</span>
          </div>
        </div>
      </div>

      {/* Info badge */}
      <div className="absolute top-6 right-6 bg-blue-600 text-white rounded-xl px-4 py-2 shadow-lg z-10">
        <p className="text-xs font-bold">📍 Interactive Map</p>
        <p className="text-xs opacity-90">Click markers for details</p>
      </div>
    </div>
  );
};

export default RouteMap;
