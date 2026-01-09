// frontend/src/utils/imageHelper.js - COMPLETE IMAGE FIX

const BACKEND_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const PLACEHOLDER = 'https://via.placeholder.com/400x300?text=No+Image';

/**
 * Normalizes image URLs to absolute URLs
 * Handles all possible backend image path formats
 */
export function normalizeImageUrl(src) {
  // Handle null/undefined
  if (!src) {
    console.warn('⚠️ No image source provided');
    return PLACEHOLDER;
  }

  // Handle string URLs
  if (typeof src === 'string') {
    const trimmed = src.trim();
    
    // Already absolute URL (http/https)
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      console.log('✅ Absolute URL:', trimmed);
      return trimmed;
    }
    
    // Relative URL starting with /uploads/
    if (trimmed.startsWith('/uploads/')) {
      const fullUrl = `${BACKEND_BASE}${trimmed}`;
      console.log('✅ Normalized /uploads/ path:', fullUrl);
      return fullUrl;
    }
    
    // Relative URL starting with uploads/ (no leading slash)
    if (trimmed.startsWith('uploads/')) {
      const fullUrl = `${BACKEND_BASE}/${trimmed}`;
      console.log('✅ Normalized uploads/ path:', fullUrl);
      return fullUrl;
    }
    
    // Just filename - assume it's in uploads
    if (!trimmed.includes('/')) {
      const fullUrl = `${BACKEND_BASE}/uploads/${trimmed}`;
      console.log('✅ Normalized filename:', fullUrl);
      return fullUrl;
    }
    
    // Other relative paths
    if (trimmed.startsWith('/')) {
      const fullUrl = `${BACKEND_BASE}${trimmed}`;
      console.log('✅ Normalized relative path:', fullUrl);
      return fullUrl;
    }
    
    const fullUrl = `${BACKEND_BASE}/${trimmed}`;
    console.log('✅ Normalized generic path:', fullUrl);
    return fullUrl;
  }

  // Handle arrays - recursively get first valid image
  if (Array.isArray(src)) {
    if (src.length > 0) {
      return normalizeImageUrl(src[0]);
    }
    console.warn('⚠️ Empty array provided');
    return PLACEHOLDER;
  }

  // Handle objects - check common properties
  if (typeof src === 'object') {
    if (src.url) return normalizeImageUrl(src.url);
    if (src.path) return normalizeImageUrl(src.path);
    if (src.src) return normalizeImageUrl(src.src);
    if (src.image) return normalizeImageUrl(src.image);
    console.warn('⚠️ Object has no image property');
  }

  // Fallback
  console.warn('⚠️ Unsupported image format:', src);
  return PLACEHOLDER;
}

/**
 * Preloads an image to check if it's valid
 */
export function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      console.log('✅ Image loaded successfully:', src);
      resolve(true);
    };
    img.onerror = () => {
      console.error('❌ Image failed to load:', src);
      resolve(false);
    };
    img.src = src;
  });
}

/**
 * Gets optimized image URL with size parameters
 */
export function getOptimizedImageUrl(src, options = {}) {
  const url = normalizeImageUrl(src);
  
  // If it's our placeholder, return as-is
  if (url === PLACEHOLDER) return url;
  
  // If it's an external URL or already has query params, return as-is
  if (url.includes('?') || !url.startsWith(BACKEND_BASE)) {
    return url;
  }
  
  // Add size parameters for backend optimization (if implemented)
  const params = new URLSearchParams();
  if (options.width) params.append('w', options.width);
  if (options.height) params.append('h', options.height);
  if (options.quality) params.append('q', options.quality);
  
  return params.toString() ? `${url}?${params}` : url;
}

export default normalizeImageUrl;