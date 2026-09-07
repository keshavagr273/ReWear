/**
 * API Configuration & Endpoint Builder
 * 
 * In development, VITE_API_BASE_URL is empty, allowing Vite's dev proxy to route
 * '/api' and '/uploads' to http://localhost:5000.
 * 
 * In production on Vercel, set VITE_API_BASE_URL to your Render backend URL:
 * e.g. VITE_API_BASE_URL=https://rewear-backend.onrender.com
 */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export function apiUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:") || path.startsWith("data:")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${cleanPath}` : cleanPath;
}
