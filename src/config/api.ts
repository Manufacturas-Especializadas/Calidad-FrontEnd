const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("API base URL is not defined in environment variables");
}

export const API_CONFIG = {
    baseUrl: API_BASE_URL,
    endpoints: {
        auth: {
            login: "/api/Auth/Login",
            register: "/api/Auth/Register",
            roles: "/api/Auth/GetRoles"
        },
        users: {
            getUsers: "/api/Users/GetUsers",
            delete: "/api/Users/DeleteUser/"
        },
        rejects: {
            defects: "/api/Rejections/GetDefects",
            conditions: "/api/Rejections/GetConditionByDefect",
            lines: "/api/Rejections/GetLines",
            clients: "/api/Rejections/GetClients",
            actions: "/api/Rejections/GetContainmentAction",
            folios: "/api/Rejections/GetNextFolio",
            rejections: "/api/Rejections/GetRejections",
            rejectionById: "/api/Rejections/GetRejectionsById/",
            download: "/api/Rejections/DownloadExcel",
            create: "/api/Rejections/Create",
            update: "/api/Rejections/Edit/",
            delete: "/api/Rejections/Delete/"
        },
        scrap: {
            scrap: "/api/Scrap/GetScrap",
            defects: "/api/Scrap/GetDefectByTypeScrap",
            typeScrap: "/api/Scrap/GetTypeScrap",
            material: "/api/Scrap/GetMaterial",
            machines: "/api/Scrap/GetMachineCodeByProcess",
            process: "/api/Scrap/GetProcessByLine",
            lines: "/api/Scrap/GetLines",
            shifts: "/api/Scrap/GetShifts",
            create: "/api/Scrap/Create"
        },
        lines: {
            lines: "/api/Lines/GetLines",
            lineById: "/api/Lines/GetLineById/",
            create: "/api/Lines/RegisterLine",
            update: "/api/Lines/UpdateLine/",
            delete: "/api/Lines/DeleteLine/"
        },
        clients: {
            clients: "/api/Clients/GetClients",
            clentById: "/api/Clients/GetClientById/",
            create: "/api/Clients/RegisterClient",
            update: "/api/Clients/UpdateClient/",
            delete: "/api/Clients/DeleteClient/"
        },
        defects: {
            defects: "/api/Defects/GetDefects",
            defectById: "/api/Defects/GetDefectById/",
            create: "/api/Defects/RegisterDefect",
            update: "/api/Defects/UpdateDefect/",
            delete: "/api/Defects/DeleteDefect/"
        },
        conditions: {
            conditions: "/api/DefectCondition/GetCondition",
            update: "/api/DefectCondition/UpdateDefectCondition/"
        }
    }
}