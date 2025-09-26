import { API_CONFIG } from "../../config/api";
import type { Actions } from "../../interfaces/Actions";
import type { Clients } from "../../interfaces/Clients";
import type { Condition } from "../../interfaces/Condition";
import type { Defects } from "../../interfaces/Defects";
import type { Lines } from "../../interfaces/Lines";
import type { Rejections } from "../../interfaces/Rejections";
import { apiClient } from "../client";


export interface RejectionFormData {
    insepector: string;
    partNumber: string;
    numberOfPieces: number;
    description: string;
    image: string;
    informedSignature: string;
    operatorPayroll: number;
    registrationDate: string;
    folio: number;
    idDefect: number;
    idCondition: number;
    idLine: number;
    idClient: number;
    idContainmentaction: number;
}

export interface RejectResponse {
    success: boolean;
    message?: string;
    rejectId?: string;
}


class RejectionService {
    private defectsEndpoint = API_CONFIG.endpoints.rejects.defects;
    private conditionEndpoint = API_CONFIG.endpoints.rejects.conditions;
    private lineEndpoint = API_CONFIG.endpoints.rejects.lines;
    private clientEndpoint = API_CONFIG.endpoints.rejects.clients;
    private actionEndpoint = API_CONFIG.endpoints.rejects.actions;
    private folioEndpoint = API_CONFIG.endpoints.rejects.folios;
    private createEndpoint = API_CONFIG.endpoints.rejects.create;
    private deleteEndpoint = API_CONFIG.endpoints.rejects.delete;
    private rejectionEndpoint = API_CONFIG.endpoints.rejects.rejections;

    private dataURLToBlob(dataURL: string): Blob {
        const parts = dataURL.split(",");
        const mime = parts[0].match(/:(.*?);/)![1];
        const binary = atob(parts[1]);
        const array = [];

        for (let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }

        return new Blob([new Uint8Array(array)], { type: mime });
    }

    async getDefects(): Promise<Defects[]> {
        return apiClient.get<Defects[]>(this.defectsEndpoint);
    }

    async getLines(): Promise<Lines[]> {
        return apiClient.get<Lines[]>(this.lineEndpoint);
    }

    async getClients(): Promise<Clients[]> {
        return apiClient.get<Clients[]>(this.clientEndpoint);
    }

    async getActions(): Promise<Actions[]> {
        return apiClient.get<Actions[]>(this.actionEndpoint);
    }

    async getNextFolio(): Promise<number> {
        return apiClient.get<number>(this.folioEndpoint);
    }

    async getRejections(): Promise<Rejections[]> {
        return apiClient.get<Rejections[]>(this.rejectionEndpoint);
    }

    async deleteReject(id: number | string): Promise<RejectResponse> {
        return apiClient.delete<RejectResponse>(`${this.deleteEndpoint}${id}`);
    }

    async getConditionByDefect(defectId: Number): Promise<Condition[]> {
        if (!defectId) return [];

        const url = `${this.conditionEndpoint}?defectId=${defectId}`

        return apiClient.get<Condition[]>(url);
    }

    async createRejection(formData: RejectionFormData, files: File[]): Promise<RejectResponse> {
        const form = new FormData();

        form.append("insepector", formData.insepector);
        form.append("partNumber", formData.partNumber);
        form.append("numberOfPieces", (formData.numberOfPieces ?? 0).toString());
        form.append("description", formData.description);
        form.append("operatorPayroll", (formData.operatorPayroll ?? 0).toString());
        form.append("registrationDate", formData.registrationDate);
        form.append("folio", (formData.folio ?? 0).toString());
        form.append("idDefect", (formData.idDefect ?? 0).toString());
        form.append("idCondition", (formData.idCondition ?? 0).toString());
        form.append("idLine", (formData.idLine ?? 0).toString());
        form.append("idClient", (formData.idClient ?? 0).toString());
        form.append("idContainmentaction", (formData.idContainmentaction ?? 0).toString());

        if (formData.informedSignature && formData.informedSignature.startsWith("data:image")) {
            const blob = this.dataURLToBlob(formData.informedSignature);
            const signatureFile = new File([blob], `signature_${Date.now()}.png`, { type: "image/png" });
            form.append("photos", signatureFile);
        }

        files.forEach(file => {
            form.append("photos", file);
        });

        const response = await apiClient.post<RejectResponse>(this.createEndpoint, form);

        return response;
    }
}

export const rejectionService = new RejectionService();