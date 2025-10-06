import { API_CONFIG } from "../../config/api";
import type { Lines } from "../../interfaces/Lines";
import type { Machines } from "../../interfaces/Machines";
import type { Material } from "../../interfaces/Material";
import type { Process } from "../../interfaces/Process";
import type { ScDefects } from "../../interfaces/ScDefects";
import type { Scrap } from "../../interfaces/Scrap";
import type { Shift } from "../../interfaces/Shift";
import type { TypeScrap } from "../../interfaces/TypeScrap";
import { apiClient } from "../client";

export interface ScrapFormData {
    shiftId: number;
    lineId: number;
    processId: number;
    payRollNumber: string;
    materialId: number;
    alloy: string;
    diameter: string;
    wall: string;
    typeScrapId: number;
    defectId: number;
    machineId: number;
    rdm: string;
};

export interface ScrapResponse {
    success?: boolean;
    message?: string;
    scrapId?: string;
};

class ScrapService {
    private scrapEndpoint = API_CONFIG.endpoints.scrap.scrap;
    private defectsEndpoint = API_CONFIG.endpoints.scrap.defects;
    private typeScrapEndpoint = API_CONFIG.endpoints.scrap.typeScrap;
    private materialEndpoint = API_CONFIG.endpoints.scrap.material;
    private machineEndpoint = API_CONFIG.endpoints.scrap.machines
    private processEndpoint = API_CONFIG.endpoints.scrap.process;
    private linesEndpoint = API_CONFIG.endpoints.scrap.lines;
    private shiftsEndpoint = API_CONFIG.endpoints.scrap.shifts;
    private createEndpoint = API_CONFIG.endpoints.scrap.create;

    async getMachineCodeByProcess(processId: number): Promise<Machines[]> {
        const url = `${this.machineEndpoint}/${processId}`;

        return apiClient.get<Machines[]>(url);
    };

    async getProcessByLine(linesId: number): Promise<Process[]> {
        const url = `${this.processEndpoint}/${linesId}`;

        return apiClient.get<Process[]>(url);
    };

    async getDefectsByTypeScrap(scrapId: number): Promise<ScDefects[]> {
        const url = `${this.defectsEndpoint}/${scrapId}`;

        return apiClient.get<ScDefects[]>(url);
    };

    async getScrap(): Promise<Scrap[]> {
        return apiClient.get<Scrap[]>(this.scrapEndpoint);
    };

    async getMaterial(): Promise<Material[]> {
        return apiClient.get<Material[]>(this.materialEndpoint);
    };

    async getLines(): Promise<Lines[]> {
        return apiClient.get<Lines[]>(this.linesEndpoint);
    };

    async getShifts(): Promise<Shift[]> {
        return apiClient.get<Shift[]>(this.shiftsEndpoint);
    };

    async getTypeScrap(): Promise<TypeScrap[]> {
        return apiClient.get<TypeScrap[]>(this.typeScrapEndpoint);
    };

    async createScrap(formData: ScrapFormData): Promise<ScrapResponse> {
        const response = await apiClient.post<ScrapResponse>(
            this.createEndpoint,
            formData
        );

        return response;
    };
};


export const scrapService = new ScrapService();