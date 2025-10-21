import { API_CONFIG } from "../../config/api";
import type { Users } from "../../interfaces/Users";
import { apiClient } from "../client";


export interface UserResponse {
    success: boolean;
    message?: string;
    userId?: string;
};

class UserService {

    private getUsersEndpoint = API_CONFIG.endpoints.users.getUsers;
    private deleteUserEndpint = API_CONFIG.endpoints.users.delete;

    async getUsers(): Promise<Users[]> {
        return apiClient.get<Users[]>(this.getUsersEndpoint);
    };

    async deleteUser(id: number | string): Promise<UserResponse> {
        return apiClient.delete<UserResponse>(`${this.deleteUserEndpint}${id}`);
    };
};

export const userService = new UserService();