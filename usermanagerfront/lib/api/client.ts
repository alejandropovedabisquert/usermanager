const API_BASE_URL_CLIENT = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';
const API_BASE_URL_SERVER = process.env.API_URL || 'http://backend:5050'; // URL interna del contenedor Docker
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {

  const isServer = typeof window === 'undefined';
  const API_BASE_URL = isServer ? API_BASE_URL_SERVER : API_BASE_URL_CLIENT;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}