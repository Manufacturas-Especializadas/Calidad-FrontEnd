import type { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";

interface Props {
    children: ReactNode;
    allowedRoles: string[];
}

export const RoleGuard = ({ children, allowedRoles }: Props) => {
    const { user } = useAuth();

    if (!user || !allowedRoles.includes(user.role)) {
        return null;
    }
    return <>{children}</>
}
