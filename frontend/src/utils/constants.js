// Central place for static asset URLs
const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');

// Logo served from frontend public folder — no backend dependency
export const LOGO_URL = '/images/logo-bus.png';
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const BASE_URL = API_BASE;
