import { createContext, useContext, useEffect, useState, type ReactNode } from "react";


interface User {
    id: string;
    name: string;
    role: string;
    payrollNumber: string;
}

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payloadBase64 = token.split('.')[1];
                if (!payloadBase64) throw new Error("Token JWT malformado");

                const payload = JSON.parse(atob(payloadBase64));
                setUser({
                    id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
                    name: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
                    role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
                    payrollNumber: payload['PayRollNumber'] || '',
                });
            } catch (error) {
                console.error("Token inválido", error);
                localStorage.removeItem("token");
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = (token: string) => {
        if (!token || typeof token !== 'string') {
            console.error("Token inválido o ausente en login()");
            logout();
            return;
        }

        try {
            const payloadBase64 = token.split('.')[1];
            if (!payloadBase64) {
                throw new Error("Token JWT malformado");
            }

            const payload = JSON.parse(atob(payloadBase64));

            const newUser: User = {
                id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
                name: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
                role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
                payrollNumber: payload['PayRollNumber'] || '',
            };

            setUser(newUser);
            localStorage.setItem("token", token);
        } catch (error) {
            console.error("Error al procesar el token:", error);
            logout();
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro del AuthProvider");
    }

    return context;
};