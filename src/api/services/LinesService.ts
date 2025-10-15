import { API_CONFIG } from "../../config/api";
import type { Lines } from "../../interfaces/Lines";
import { apiClient } from "../client";

export interface LineFormData {
    name: string;
};


export interface LinesResponse {
    success?: boolean;
    message?: string;
    lineId?: string;
};

class LinesService {
    private getLinesEndpoint = API_CONFIG.endpoints.lines.lines;
    private getLineByIdEndpoint = API_CONFIG.endpoints.lines.lineById;
    private createLineEndpoint = API_CONFIG.endpoints.lines.create;
    private updateLineEndpoint = API_CONFIG.endpoints.lines.update;
    private deleteLineEndpoint = API_CONFIG.endpoints.lines.delete;

    async getLines(): Promise<Lines[]> {
        return apiClient.get<Lines[]>(this.getLinesEndpoint);
    };

    async getLineById(id: number): Promise<Lines> {
        const response = await apiClient.get<Lines>(`${this.getLineByIdEndpoint}${id}`);

        return response;
    };

    async updateLine(id: number, formData: LineFormData): Promise<LinesResponse> {
        const response = await apiClient.put<LinesResponse>(
            `${this.updateLineEndpoint}${id}`,
            formData
        );

        return response;
    };

    async createLine(formData: LineFormData): Promise<LinesResponse> {
        const response = await apiClient.post<LinesResponse>(
            this.createLineEndpoint,
            formData
        );
        return response;
    };

    async deleteLine(id: number | string): Promise<LinesResponse> {
        return apiClient.delete<LinesResponse>(`${this.deleteLineEndpoint}${id}`);
    };
};

export const linesService = new LinesService();