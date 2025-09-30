import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";
import type { ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

export const PublicRoute = ({ children }: Props) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    if (children) {
        return <>{children}</>
    }

    return <Outlet />;
};
