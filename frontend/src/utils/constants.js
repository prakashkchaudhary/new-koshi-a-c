// Central place for static asset URLs
const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');

export const LOGO_URL = `${API_BASE}/uploads/logo.png`;
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const BASE_URL = API_BASE;
