import React, { useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const RouteMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const navigate = useNavigate();

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

  // Bus routes with actual highway waypoints and booking info
  const routes = useMemo(() => [
    { 
      id: 'dharan-ktm-sindhuli',
      name: 'Dharan → Kathmandu (via Sindhuli)',
      shortName: 'DHR → KTM',
      type: 'Night Service - BP Highway',
      color: '#3B82F6',
      waypoints: [
        cities.dharan,
        cities.bardibas,
        cities.sindhuli,
        cities.kathmandu
      ],
      distance: '385 km',
      duration: '10-11 hours',
      searchQuery: 'from=Dharan&to=Kathmandu',
      busIcon: '🚌',
      price: 'रू 1,400'
    },
    { 
      id: 'ktm-dharan-sindhuli',
      name: 'Kathmandu → Dharan (via Sindhuli)',
      shortName: 'KTM → DHR',
      type: 'Night Service - BP Highway',
      color: '#8B5CF6',
      waypoints: [
        cities.kathmandu,
        cities.sindhuli,
        cities.bardibas,
        cities.dharan
      ],
      distance: '385 km',
      duration: '10-11 hours',
      searchQuery: 'from=Kathmandu&to=Dharan',
      busIcon: '🚌',
      price: 'रू 1,400'
    },
    { 
      id: 'dharan-ktm-muglin',
      name: 'Dharan → Kathmandu (via Muglin)',
      shortName: 'DHR → KTM',
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
      duration: '12-13 hours',
      searchQuery: 'from=Dharan&to=Kathmandu',
      busIcon: '🚌',
      price: 'रू 1,200'
    },
    { 
      id: 'ktm-delhi',
      name: 'Kathmandu → Delhi',
      shortName: 'KTM → DEL',
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
      duration: '24-26 hours',
      searchQuery: 'from=Kathmandu&to=Delhi',
      busIcon: '🚍',
      price: 'रू 3,500'
    }
  ], [cities]);

  useEffect(() => {
    // Only load if Leaflet is available
    if (!window.L || mapInstanceRef.current) return;

    const L = window.L;

    // Initialize map with better styling
    const map = L.map(mapRef.current, {
      center: [27.0, 82.0],
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: true,
      minZoom: 5,
      maxZoom: 13
    });

    mapInstanceRef.current = map;

    // Use Google-style map tiles (CartoDB Voyager for better roads)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Custom marker icons for main terminals
    const createTerminalIcon = (emoji, color = '#3B82F6') => L.divIcon({
      className: 'custom-terminal-marker',
      html: `<div style="
        background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
        border: 4px solid white;
        cursor: pointer;
        transition: all 0.3s;
        animation: pulse 2s infinite;
      " onmouseover="this.style.transform='scale(1.15) rotate(5deg)'" 
         onmouseout="this.style.transform='scale(1) rotate(0deg)'">${emoji}</div>
      <style>
        @keyframes pulse {
          0%, 100% { box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35); }
          50% { box-shadow: 0 6px 30px ${color}80; }
        }
      </style>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
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
        <div style="text-align: center; font-family: 'Poppins', sans-serif; min-width: 180px; padding: 8px;">
          <div style="font-size: 32px; margin-bottom: 10px;">${city.icon || '🚌'}</div>
          <strong style="font-size: 18px; color: #1F2937; display: block; margin-bottom: 6px;">${city.name}</strong>
          <p style="font-size: 13px; color: #6B7280; margin: 0 0 12px 0;">Main Bus Terminal</p>
          <div style="background: linear-gradient(135deg, ${color}20 0%, ${color}10 100%); 
                      padding: 8px; border-radius: 8px; border-left: 3px solid ${color};">
            <p style="font-size: 12px; color: #4B5563; margin: 0;">
              📍 GPS Tracked Buses<br/>
              🎫 Online Booking Available
            </p>
          </div>
        </div>
      `);
    });

    // Add waypoint markers (smaller, subtle)
    const waypointIcon = L.divIcon({
      className: 'waypoint-marker',
      html: `<div style="
        background: white;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 3px solid #6B7280;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [10, 10],
      iconAnchor: [5, 5],
    });

    const waypoints = [cities.sindhuli, cities.muglin, cities.birgunj, cities.patna, cities.lucknow];
    waypoints.forEach(city => {
      const marker = L.marker([city.lat, city.lng], { icon: waypointIcon }).addTo(map);
      marker.bindPopup(`
        <div style="text-align: center; font-family: 'Poppins', sans-serif; padding: 4px;">
          <strong style="font-size: 14px; color: #1F2937;">${city.name}</strong>
          <p style="font-size: 11px; color: #6B7280; margin: 4px 0 0 0;">🛑 Stop</p>
        </div>
      `);
    });

    // Draw routes with enhanced styling
    routes.forEach((route, index) => {
      const latlngs = route.waypoints.map(wp => [wp.lat, wp.lng]);

      // Main route line with glow effect
      const polyline = L.polyline(latlngs, {
        color: route.color,
        weight: 6,
        opacity: 0.85,
        smoothFactor: 3,
        className: `route-line route-${index}`
      }).addTo(map);

      // Animated dashed overlay
      const dashedOverlay = L.polyline(latlngs, {
        color: route.color,
        weight: 6,
        opacity: 0.5,
        dashArray: '20, 20',
        dashOffset: '0',
        className: `route-dash route-dash-${index}`
      }).addTo(map);

      // Animate the dashed line
      let offset = 0;
      setInterval(() => {
        offset = (offset + 2) % 40;
        if (dashedOverlay._path) {
          dashedOverlay._path.style.strokeDashoffset = offset;
        }
      }, 100);

      // Add animated bus marker on route
      const midIndex = Math.floor(route.waypoints.length / 2);
      const busPosition = route.waypoints[midIndex];

      const busMarker = L.marker([busPosition.lat, busPosition.lng], {
        icon: L.divIcon({
          className: 'bus-marker-animated',
          html: `<div style="
            background: linear-gradient(135deg, ${route.color} 0%, ${route.color}dd 100%);
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
            border: 4px solid white;
            cursor: pointer;
            transition: all 0.3s;
            animation: bounce 2s infinite;
          " onmouseover="this.style.transform='scale(1.2)'" 
             onmouseout="this.style.transform='scale(1)'">
            ${route.busIcon}
          </div>
          <style>
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-8px); }
            }
          </style>`,
          iconSize: [50, 50],
          iconAnchor: [25, 25],
        })
      }).addTo(map);

      // Make bus marker clickable - redirects to booking
      busMarker.on('click', () => {
        navigate(`/buses?${route.searchQuery}`);
      });

      // Enhanced bus marker popup
      busMarker.bindPopup(`
        <div style="font-family: 'Poppins', sans-serif; min-width: 240px; padding: 12px;">
          <div style="text-align: center; margin-bottom: 12px;">
            <div style="font-size: 36px; margin-bottom: 8px;">${route.busIcon}</div>
            <strong style="color: ${route.color}; font-size: 16px; display: block; margin-bottom: 4px;">
              ${route.shortName}
            </strong>
            <span style="font-size: 12px; color: #6B7280;">${route.type}</span>
          </div>
          
          <div style="background: linear-gradient(135deg, ${route.color}15 0%, ${route.color}05 100%); 
                      padding: 12px; border-radius: 10px; margin-bottom: 12px;
                      border: 2px solid ${route.color}30;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 12px; color: #4B5563;">📏 Distance</span>
              <strong style="font-size: 12px; color: #1F2937;">${route.distance}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 12px; color: #4B5563;">⏱️ Duration</span>
              <strong style="font-size: 12px; color: #1F2937;">${route.duration}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 12px; color: #4B5563;">💰 Price</span>
              <strong style="font-size: 13px; color: ${route.color};">${route.price}</strong>
            </div>
          </div>
          
          <button onclick="window.location.href='/buses?${route.searchQuery}'" 
                  style="width: 100%; 
                         background: linear-gradient(135deg, ${route.color} 0%, ${route.color}dd 100%);
                         color: white;
                         border: none;
                         padding: 12px;
                         border-radius: 10px;
                         font-size: 14px;
                         font-weight: 700;
                         cursor: pointer;
                         box-shadow: 0 4px 12px ${route.color}40;
                         transition: all 0.3s;
                         font-family: 'Poppins', sans-serif;"
                  onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px ${route.color}60'"
                  onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px ${route.color}40'">
            🎫 Book This Route Now →
          </button>
        </div>
      `);

      // Add route label
      L.marker([busPosition.lat, busPosition.lng + 0.3], {
        icon: L.divIcon({
          className: 'route-label',
          html: `<div style="
            background: white;
            padding: 10px 16px;
            border-radius: 25px;
            font-size: 13px;
            font-weight: 700;
            color: ${route.color};
            box-shadow: 0 4px 15px rgba(0,0,0,0.25);
            white-space: nowrap;
            border: 3px solid ${route.color};
            font-family: 'Poppins', sans-serif;
          ">${route.shortName}</div>`,
          iconSize: [0, 0],
        })
      }).addTo(map);

      // Bind popup to route line
      polyline.bindPopup(`
        <div style="font-family: 'Poppins', sans-serif; min-width: 220px; padding: 10px;">
          <strong style="color: ${route.color}; font-size: 15px; display: block; margin-bottom: 8px;">
            ${route.name}
          </strong>
          <p style="font-size: 12px; color: #6B7280; margin: 0 0 10px 0;">${route.type}</p>
          <div style="background: #F3F4F6; padding: 10px; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #4B5563; margin-bottom: 6px;">
              <span>📏 ${route.distance}</span>
              <span>⏱️ ${route.duration}</span>
            </div>
            <div style="text-align: center; margin-top: 8px;">
              <strong style="color: ${route.color}; font-size: 14px;">${route.price}</strong>
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
  }, [cities, routes, navigate]);

  return (
    <div className="relative">
      {/* Map container */}
      <div 
        ref={mapRef} 
        className="w-full h-[650px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
        style={{ zIndex: 1 }}
      />
      
      {/* Enhanced Legend with booking CTA */}
      <div className="absolute bottom-6 left-6 bg-white/98 backdrop-blur-sm rounded-xl p-5 shadow-xl border-2 border-gray-200 z-10 max-w-xs">
        <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-lg">🗺️</span> Our Route Network
        </h4>
        
        {/* Click instruction */}
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
          <p className="text-xs font-bold text-blue-900 flex items-center gap-2">
            <span className="text-lg animate-bounce">👆</span>
            Click bus icons to book tickets!
          </p>
        </div>
        
        <div className="space-y-3">
          {routes.map((route, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="text-xl flex-shrink-0">{route.busIcon}</div>
                <div 
                  className="w-8 h-1.5 rounded-full flex-shrink-0" 
                  style={{ 
                    background: route.color,
                    boxShadow: `0 0 10px ${route.color}60`
                  }}
                />
                <span className="text-xs text-gray-700 font-semibold leading-tight">
                  {route.shortName}
                </span>
              </div>
              <div className="ml-12 text-xs text-gray-500 flex items-center justify-between">
                <span>{route.distance}</span>
                <span className="font-bold" style={{ color: route.color }}>{route.price}</span>
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

      {/* Enhanced Info badge with animation */}
      <div className="absolute top-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl px-5 py-3 shadow-xl z-10 animate-pulse-slow">
        <p className="text-xs font-bold flex items-center gap-2">
          <span className="text-base">🚌</span> Live Route Map
        </p>
        <p className="text-xs opacity-90 mt-1">Click buses to book instantly!</p>
      </div>

      {/* Route info cards */}
      <div className="absolute top-6 left-6 space-y-2 z-10 max-w-xs">
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg px-4 py-2 shadow-lg backdrop-blur-sm bg-white/90">
          <p className="text-xs font-bold text-blue-900">🛣️ BP Highway (Sindhuli)</p>
          <p className="text-xs text-blue-700">Fastest route • 385 km • रू 1,400</p>
        </div>
        <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg px-4 py-2 shadow-lg backdrop-blur-sm bg-white/90">
          <p className="text-xs font-bold text-green-900">🛣️ Prithvi Highway (Muglin)</p>
          <p className="text-xs text-green-700">Scenic route • 450 km • रू 1,200</p>
        </div>
      </div>

      {/* Floating booking CTA */}
      <div className="absolute bottom-6 right-6 z-10">
        <button
          onClick={() => navigate('/buses')}
          className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-full font-bold text-sm shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 animate-bounce-slow"
        >
          <span className="text-lg">🎫</span>
          View All Buses
        </button>
      </div>
    </div>
  );
};

export default RouteMap;
