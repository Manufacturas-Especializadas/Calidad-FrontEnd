import { API_CONFIG } from "../../config/api";
import type { Condition } from "../../interfaces/Condition";
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

class DefectCondition {
    private getDefectConditionEndpoint = API_CONFIG.endpoints.conditions.conditions;
    private updateDefectConditionEndpoint = API_CONFIG.endpoints.conditions.update;

    async getDefectCondition(): Promise<Condition[]> {
        return apiClient.get<Condition[]>(this.getDefectConditionEndpoint);
    };

    async updateDefectCondition(id: number, formData: DefectConditionFormData): Promise<DefectConditionResponse> {
        const response = await apiClient.put<DefectConditionResponse>(
            `${this.updateDefectConditionEndpoint}${id}`,
            formData
        );

        return response;
    };
};

export const defectCondition = new DefectCondition();