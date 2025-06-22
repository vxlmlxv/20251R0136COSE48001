
import { toast } from "@/components/ui/use-toast";

// Base API URL - updated to use Spring backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Default request timeout in milliseconds
const DEFAULT_TIMEOUT = 30000;

type RequestOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  withAuth?: boolean;
};

/**
 * Makes an API request with FormData (for file uploads)
 */
export async function apiFormDataRequest<T = unknown>(
  endpoint: string,
  formData: FormData,
  options: Omit<RequestOptions, 'method' | 'body'> = {}
): Promise<T> {
  const { headers = {}, timeout = DEFAULT_TIMEOUT, withAuth = true } = options;
  
  // Create a controller for the timeout functionality
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    // Prepare headers - don't set Content-Type for FormData, let browser set it
    const requestHeaders: Record<string, string> = {
      ...headers,
    };
    
    // Add auth token from localStorage if the request requires authentication
    if (withAuth) {
      const userData = localStorage.getItem('prefUser');
      if (userData) {
        const user = JSON.parse(userData);
        // In a real app, this would be a JWT token
        requestHeaders['Authorization'] = `Bearer ${user.id}`;
      }
    }
    
    // Prepare request options
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: requestHeaders,
      body: formData,
      signal: controller.signal,
    };
    
    // Make the request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    
    // Clear the timeout since the request completed
    clearTimeout(timeoutId);
    
    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API request failed with status ${response.status}`
      );
    }
    
    // Parse JSON response
    return await response.json();
  } catch (error: any) {
    // Clear the timeout in case of error
    clearTimeout(timeoutId);
    
    // Handle errors
    console.error(`API form data request error for ${endpoint}:`, error);
    
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

/**
 * Makes an API request with proper error handling
 */
export async function apiRequest<T = unknown>(
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
      const userData = localStorage.getItem('prefUser');
      if (userData) {
        const user = JSON.parse(userData);
        // In a real app, this would be a JWT token
        requestHeaders['Authorization'] = `Bearer ${user.id}`;
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API request failed with status ${response.status}`
      );
    }
    
    // Parse JSON response
    return await response.json();
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
  get: <T = unknown>(endpoint: string, options?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T = unknown>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, body, method: 'POST' }),
  
  postFormData: <T = unknown>(endpoint: string, formData: FormData, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiFormDataRequest<T>(endpoint, formData, options),
  
  put: <T = unknown>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, body, method: 'PUT' }),
  
  patch: <T = unknown>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, body, method: 'PATCH' }),
  
  delete: <T = unknown>(endpoint: string, options?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};
