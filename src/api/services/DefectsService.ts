import { API_CONFIG } from "../../config/api";
import type { Defects } from "../../interfaces/Defects";
import { apiClient } from "../client";

export interface DefectFormData {
    name: string;
};

export interface DefectResponse {
    success?: boolean;
    message?: string;
    defectId?: string;
};

class DefectsService {
    private getDefectEndpoint = API_CONFIG.endpoints.defects.defects;
    private getDefectByIdEndpoint = API_CONFIG.endpoints.defects.defectById;
    private createDefectEndpoint = API_CONFIG.endpoints.defects.create;
    private updateDefectEndpoint = API_CONFIG.endpoints.defects.update;
    private deleteDefectEndpoint = API_CONFIG.endpoints.defects.delete;

    async getDefects(): Promise<Defects[]> {
        return apiClient.get<Defects[]>(this.getDefectEndpoint);
    };

    async getDefectById(id: number): Promise<Defects> {
        const response = await apiClient.get<Defects>(`${this.getDefectByIdEndpoint}${id}`);

        return response;
    };

    async createDefect(formData: DefectFormData): Promise<DefectResponse> {
        const response = await apiClient.post<DefectResponse>(
            this.createDefectEndpoint,
            formData
        );
        return response;
    };

    async updateDefect(id: number, formData: DefectFormData): Promise<DefectResponse> {
        const response = await apiClient.put<DefectResponse>(
            `${this.updateDefectEndpoint}${id}`,
            formData
        );

        return response
    };

    async deleteDefect(id: number | string): Promise<DefectResponse> {
        return apiClient.delete<DefectResponse>(`${this.deleteDefectEndpoint}${id}`);
    };
};

export const defectsService = new DefectsService();