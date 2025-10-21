import { API_CONFIG } from "../../config/api";
import type { DefectCondition } from "../../interfaces/DefectCondition";
import type { Defects } from "../../interfaces/Defects";
import { apiClient } from "../client";

export interface DefectConditionFormData {
    idDefects: number;
    name: string
};

export interface DefectConditionResponse {
    success?: boolean;
    message?: string;
    conditioId?: string;
};

class DefectConditionService {
    private getDefectEndpoint = API_CONFIG.endpoints.conditions.getDefects;
    private getDefectConditionEndpoint = API_CONFIG.endpoints.conditions.conditions;
    private getConditionByIdEndpoint = API_CONFIG.endpoints.conditions.getConditionById;
    private getConditionByDefectEndpoint = API_CONFIG.endpoints.conditions.getConditionByDefect;
    private createDefectConditionEndpoint = API_CONFIG.endpoints.conditions.create;
    private updateDefectConditionEndpoint = API_CONFIG.endpoints.conditions.update;
    private deleteDefectConditionEndpoint = API_CONFIG.endpoints.conditions.delete;

    async getDefectCondition(): Promise<DefectCondition[]> {
        return apiClient.get<DefectCondition[]>(this.getDefectConditionEndpoint);
    };

    async getDefects(): Promise<Defects[]> {
        return apiClient.get<Defects[]>(this.getDefectEndpoint);
    };

    async getConditionById(id: number): Promise<DefectCondition | null> {
        const url = `${this.getConditionByIdEndpoint}${id}`;
        try {
            const response = await apiClient.get<DefectCondition>(url);
            return response;
        } catch (error) {
            console.error("Error fetching condition by id:", error);
            return null;
        }
    }

    async getConditionByDefect(idDefect: number): Promise<DefectCondition[]> {
        const url = `${this.getConditionByDefectEndpoint}?idDefect=${encodeURIComponent(idDefect)}`;
        return apiClient.get<DefectCondition[]>(url);
    };

    async createDefectCondition(formData: DefectConditionFormData): Promise<DefectConditionResponse> {
        const dataToSend = {
            idDefects: formData.idDefects,
            name: formData.name
        };

        const response = await apiClient.post<DefectConditionResponse>(this.createDefectConditionEndpoint, dataToSend);

        return response;
    };

    async updateDefectCondition(id: number, formData: DefectConditionFormData): Promise<DefectConditionResponse> {
        const response = await apiClient.put<DefectConditionResponse>(
            `${this.updateDefectConditionEndpoint}${id}`,
            formData
        );

        return response;
    };

    async deleteDefectCondition(id: number | string): Promise<DefectConditionResponse> {
        return apiClient.delete<DefectConditionResponse>(`${this.deleteDefectConditionEndpoint}${id}`);
    };
};

export const defectConditionService = new DefectConditionService();