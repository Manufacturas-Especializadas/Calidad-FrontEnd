import { API_CONFIG } from "../config/api";

class ApiClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_CONFIG.baseUrl;
    }

    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeaders(),
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP Error: ${response.status} - ${response.statusText}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json() as Promise<T>;
        }

        return null as unknown as T;
    }

    get<T>(endpoint: string) {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, data: any): Promise<T> {
        const fullUrl = `${this.baseUrl}${endpoint}`;
        const authHeaders = this.getAuthHeaders();

        if (data instanceof FormData) {
            const response = await fetch(fullUrl, {
                method: "POST",
                headers: {
                    ...authHeaders,
                },
                body: data,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Error en la solicitud");
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return response.json();
            }
            return null as unknown as T;
        } else {
            const response = await fetch(fullUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Error en la solicitud");
            }

            return response.json();
        }
    }

    put<T>(endpoint: string, body: any) {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    delete<T>(endpoint: string) {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

export const apiClient = new ApiClient();