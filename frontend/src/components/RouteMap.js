import React, { useEffect, useRef, useMemo } from 'react';

const RouteMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Nepal and India city coordinates
  const cities = useMemo(() => ({
    kathmandu: { lat: 27.7172, lng: 85.3240, name: 'Kathmandu', icon: '🏛️' },
    dharan: { lat: 26.8149, lng: 87.2824, name: 'Dharan', icon: '🚌' },
    delhi: { lat: 28.6139, lng: 77.2090, name: 'New Delhi', icon: '🇮🇳' },
    // Waypoints for routes
    sindhuli: { lat: 27.2667, lng: 85.9667, name: 'Sindhuli' },
    bardibas: { lat: 27.0167, lng: 85.9000, name: 'Bardibas' },
    gaur: { lat: 26.7667, lng: 85.2833, name: 'Gaur' },
    muglin: { lat: 27.8167, lng: 84.5667, name: 'Muglin' },
    narayanghat: { lat: 27.7000, lng: 84.4333, name: 'Narayanghat' },
    hetauda: { lat: 27.4281, lng: 85.0325, name: 'Hetauda' },
    birgunj: { lat: 27.0000, lng: 84.8667, name: 'Birgunj' },
    raxaul: { lat: 26.9833, lng: 84.8500, name: 'Raxaul (Border)' },
    patna: { lat: 25.5941, lng: 85.1376, name: 'Patna' },
    lucknow: { lat: 26.8467, lng: 80.9462, name: 'Lucknow' }
  }), []);

  // Bus routes with actual highway waypoints
  const routes = useMemo(() => [
    { 
      name: 'Dharan → Kathmandu (via Sindhuli)',
      type: 'Night Service - BP Highway',
      color: '#3B82F6',
      waypoints: [
        cities.dharan,
        cities.bardibas,
        cities.sindhuli,
        cities.kathmandu
      ],
      distance: '385 km',
      duration: '10-11 hours'
    },
    { 
      name: 'Kathmandu → Dharan (via Sindhuli)',
      type: 'Night Service - BP Highway',
      color: '#8B5CF6',
      waypoints: [
        cities.kathmandu,
        cities.sindhuli,
        cities.bardibas,
        cities.dharan
      ],
      distance: '385 km',
      duration: '10-11 hours'
    },
    { 
      name: 'Dharan → Kathmandu (via Muglin)',
      type: 'Day Service - Prithvi Highway',
      color: '#10B981',
      waypoints: [
        cities.dharan,
        cities.bardibas,
        cities.hetauda,
        cities.narayanghat,
        cities.muglin,
        cities.kathmandu
      ],
      distance: '450 km',
      duration: '12-13 hours'
    },
    { 
      name: 'Kathmandu → Delhi',
      type: 'International Service',
      color: '#F59E0B',
      waypoints: [
        cities.kathmandu,
        cities.hetauda,
        cities.birgunj,
        cities.raxaul,
        cities.patna,
        cities.lucknow,
        cities.delhi
      ],
      distance: '1,050 km',
      duration: '24-26 hours'
    }
  ], [cities]);

  useEffect(() => {
    // Only load if Leaflet is available
    if (!window.L || mapInstanceRef.current) return;

    const L = window.L;

    // Initialize map - wider view to show Delhi
    const map = L.map(mapRef.current, {
      center: [27.0, 82.0], // Centered between Nepal and Delhi
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: true, // Enable scroll zoom for better interaction
      minZoom: 5,
      maxZoom: 12
    });

    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles with better styling
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Custom marker icons for main terminals
    const createTerminalIcon = (emoji, color = '#3B82F6') => L.divIcon({
      className: 'custom-terminal-marker',
      html: `<div style="
        background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        border: 3px solid white;
        cursor: pointer;
        transition: transform 0.2s;
      " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">${emoji}</div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    // Add main terminal markers
    const mainTerminals = [
      { city: cities.kathmandu, color: '#3B82F6' },
      { city: cities.dharan, color: '#10B981' },
      { city: cities.delhi, color: '#F59E0B' }
    ];

    mainTerminals.forEach(({ city, color }) => {
      const marker = L.marker([city.lat, city.lng], { 
        icon: createTerminalIcon(city.icon || '🚌', color)
      }).addTo(map);
      
      marker.bindPopup(`
        <div style="text-align: center; font-family: 'Poppins', sans-serif; min-width: 150px;">
          <div style="font-size: 24px; margin-bottom: 8px;">${city.icon || '🚌'}</div>
          <strong style="font-size: 16px; color: #1F2937;">${city.name}</strong>
          <p style="font-size: 12px; color: #6B7280; margin: 4px 0 0 0;">Main Bus Terminal</p>
        </div>
      `);
    });

    // Add waypoint markers (smaller, subtle)
    const waypointIcon = L.divIcon({
      className: 'waypoint-marker',
      html: `<div style="
        background: white;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        border: 2px solid #6B7280;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      "></div>`,
      iconSize: [8, 8],
      iconAnchor: [4, 4],
    });

    // Add waypoint markers for major stops
    const waypoints = [cities.sindhuli, cities.muglin, cities.birgunj, cities.patna, cities.lucknow];
    waypoints.forEach(city => {
      const marker = L.marker([city.lat, city.lng], { icon: waypointIcon }).addTo(map);
      marker.bindPopup(`
        <div style="text-align: center; font-family: 'Poppins', sans-serif;">
          <strong style="font-size: 13px; color: #1F2937;">${city.name}</strong>
          <p style="font-size: 11px; color: #6B7280; margin: 2px 0 0 0;">Stop</p>
        </div>
      `);
    });

    // Draw routes with curved lines following waypoints
    routes.forEach((route, index) => {
      const latlngs = route.waypoints.map(wp => [wp.lat, wp.lng]);

      // Create smooth curved polyline
      const polyline = L.polyline(latlngs, {
        color: route.color,
        weight: 5,
        opacity: 0.8,
        smoothFactor: 3,
        className: `route-line route-${index}`
      }).addTo(map);

      // Add animated dashed overlay for movement effect
      const dashedOverlay = L.polyline(latlngs, {
        color: route.color,
        weight: 5,
        opacity: 0.4,
        dashArray: '15, 15',
        dashOffset: '0',
        className: `route-dash route-dash-${index}`
      }).addTo(map);

      // Animate the dashed line
      let offset = 0;
      setInterval(() => {
        offset = (offset + 1) % 30;
        if (dashedOverlay._path) {
          dashedOverlay._path.style.strokeDashoffset = offset;
        }
      }, 100);

      // Add route label at midpoint
      const midIndex = Math.floor(route.waypoints.length / 2);
      const midPoint = route.waypoints[midIndex];

      L.marker([midPoint.lat, midPoint.lng], {
        icon: L.divIcon({
          className: 'route-label',
          html: `<div style="
            background: white;
            padding: 8px 14px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            color: ${route.color};
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            white-space: nowrap;
            border: 2px solid ${route.color};
            font-family: 'Poppins', sans-serif;
          ">${route.name.split('(')[0].trim()}</div>`,
          iconSize: [0, 0],
        })
      }).addTo(map);

      // Bind detailed popup to route line
      polyline.bindPopup(`
        <div style="font-family: 'Poppins', sans-serif; min-width: 200px;">
          <strong style="color: ${route.color}; font-size: 14px;">${route.name}</strong>
          <p style="font-size: 12px; color: #6B7280; margin: 6px 0 4px 0;">${route.type}</p>
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E7EB;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #4B5563;">
              <span>📏 ${route.distance}</span>
              <span>⏱️ ${route.duration}</span>
            </div>
          </div>
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
        className="w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
        style={{ zIndex: 1 }}
      />
      
      {/* Enhanced Legend */}
      <div className="absolute bottom-6 left-6 bg-white/98 backdrop-blur-sm rounded-xl p-5 shadow-xl border border-gray-200 z-10 max-w-xs">
        <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-lg">🗺️</span> Our Route Network
        </h4>
        <div className="space-y-3">
          {routes.map((route, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center gap-2">
                <div 
                  className="w-10 h-1.5 rounded-full flex-shrink-0" 
                  style={{ 
                    background: route.color,
                    boxShadow: `0 0 10px ${route.color}60`
                  }}
                />
                <span className="text-xs text-gray-700 font-semibold leading-tight">
                  {route.name.split('(')[0].trim()}
                </span>
              </div>
              <div className="ml-12 text-xs text-gray-500">
                {route.distance} • {route.duration}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-sm flex-shrink-0">
              🏛️
            </div>
            <span>Main Terminal</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-2 h-2 rounded-full bg-white border-2 border-gray-400 flex-shrink-0 ml-2.5"></div>
            <span>Waypoint/Stop</span>
          </div>
        </div>
      </div>

      {/* Enhanced Info badge */}
      <div className="absolute top-6 right-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl px-5 py-3 shadow-xl z-10">
        <p className="text-xs font-bold flex items-center gap-2">
          <span className="text-base">📍</span> Interactive Highway Map
        </p>
        <p className="text-xs opacity-90 mt-1">Click routes & terminals for details</p>
      </div>

      {/* Route info cards */}
      <div className="absolute top-6 left-6 space-y-2 z-10 max-w-xs">
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg px-4 py-2 shadow-lg">
          <p className="text-xs font-bold text-blue-900">🛣️ BP Highway (Sindhuli)</p>
          <p className="text-xs text-blue-700">Fastest route • 385 km</p>
        </div>
        <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg px-4 py-2 shadow-lg">
          <p className="text-xs font-bold text-green-900">🛣️ Prithvi Highway (Muglin)</p>
          <p className="text-xs text-green-700">Scenic route • 450 km</p>
        </div>
      </div>
    </div>
  );
};

export default RouteMap;
