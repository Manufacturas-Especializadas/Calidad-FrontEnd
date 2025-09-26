const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("API base URL is not defined in environment variables");
}

export const API_CONFIG = {
    baseUrl: API_BASE_URL,
    endpoints: {
        rejects: {
            defects: "/api/Rejections/GetDefects",
            conditions: "/api/Rejections/GetConditionByDefect",
            lines: "/api/Rejections/GetLines",
            clients: "/api/Rejections/GetClients",
            actions: "/api/Rejections/GetContainmentAction",
            folios: "/api/Rejections/GetNextFolio",
            rejections: "/api/Rejections/GetRejections",
            create: "/api/Rejections/Create",
            delete: "/api/Rejections/Delete/"
        }
    }
}