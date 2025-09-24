import { API_CONFIG } from "../config/api";


class ApiClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_CONFIG.baseUrl;
    };

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
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

    async post<T>(endpoint: string, data: FormData): Promise<T> {
        const fullUrl = `${this.baseUrl}${endpoint}`;
        const response = await fetch(fullUrl, {
            method: "POST",
            body: data,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Error en la solicitud");
        }

        return response.json();
    }

    put<T>(endpoint: string, body: any) {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    delete<T>(endpoint: string) {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

export const apiClient = new ApiClient();