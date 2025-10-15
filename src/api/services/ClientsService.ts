import { API_CONFIG } from "../../config/api";
import type { Clients } from "../../interfaces/Clients";
import { apiClient } from "../client";


export interface ClientFormData {
    name: string;
};

export interface ClientResponse {
    success?: boolean;
    message?: string;
    clientId?: string;
};

class ClientService {
    private getClientsEndpoint = API_CONFIG.endpoints.clients.clients;
    private getClientByEndpoint = API_CONFIG.endpoints.clients.clentById;
    private createClientEndpoint = API_CONFIG.endpoints.clients.create;
    private updateClientEndpoint = API_CONFIG.endpoints.clients.update;
    private deleteClientEndpoint = API_CONFIG.endpoints.clients.delete;

    async getClients(): Promise<Clients[]> {
        return apiClient.get<Clients[]>(this.getClientsEndpoint);
    };

    async getClientById(id: number): Promise<Clients> {
        const response = await apiClient.get<Clients>(`${this.getClientByEndpoint}${id}`);

        return response;
    };

    async createClient(formData: ClientFormData): Promise<ClientResponse> {
        const response = await apiClient.post<ClientResponse>(
            this.createClientEndpoint,
            formData
        );
        return response
    };

    async updateClient(id: number, formData: ClientFormData): Promise<ClientResponse> {
        const response = await apiClient.put<ClientResponse>(
            `${this.updateClientEndpoint}${id}`,
            formData
        );

        return response;
    };

    async deleteClient(id: number | string): Promise<ClientResponse> {
        return apiClient.delete<ClientResponse>(`${this.deleteClientEndpoint}${id}`);
    };
};

export const clientService = new ClientService();