
import { toast } from "@/components/ui/use-toast";
import { API_CONFIG, STORAGE_KEYS } from "./config";

// Base API URL from configuration
const API_BASE_URL = API_CONFIG.BASE_URL;

// Default request timeout in milliseconds
const DEFAULT_TIMEOUT = API_CONFIG.TIMEOUT;

type RequestOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  withAuth?: boolean;
};

/**
 * Makes an API request with proper error handling
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions
): Promise<T> {
  const { method, headers = {}, body, timeout = DEFAULT_TIMEOUT, withAuth = true } = options;
  
  // Create a controller for the timeout functionality
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    // Prepare headers - add auth token if needed
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };
    
    // Add auth token from localStorage if the request requires authentication
    if (withAuth) {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }
    
    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      signal: controller.signal,
    };
    
    // Add body for non-GET requests
    if (method !== 'GET' && body) {
      requestOptions.body = JSON.stringify(body);
    }
    
    // Make the request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    
    // Clear the timeout since the request completed
    clearTimeout(timeoutId);
    
    // Handle HTTP errors
    if (!response.ok) {
      const errorText = await response.text();
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      
      throw new Error(
        errorData.message || `API request failed with status ${response.status}`
      );
    }
    
    // Parse JSON response
    const responseData = await response.json();
    return responseData;
  } catch (error: any) {
    // Clear the timeout in case of error
    clearTimeout(timeoutId);
    
    // Handle errors
    console.error(`API request error for ${endpoint}:`, error);
    
    // Show toast notification for user feedback
    toast({
      title: 'Error',
      description: error.message || 'An unexpected error occurred',
      variant: 'destructive',
    });
    
    // Re-throw for further handling
    throw error;
  }
}

// Convenience methods
export const api = {
  get: <T = any>(endpoint: string, options?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, body, method: 'POST' }),
  
  put: <T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, body, method: 'PUT' }),
  
  patch: <T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, body, method: 'PATCH' }),
  
  delete: <T = any>(endpoint: string, options?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};
