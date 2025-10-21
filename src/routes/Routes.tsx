import { Navigate, Route, Routes } from "react-router";
import { RejectionIndex } from "../pages/Rejections/RejectionIndex";
import { ProcessAudit } from "../pages/ProcessAudit/ProcessAudit";
import { ProductAudit } from "../pages/ProductAudit/ProductAudit";
import { AdminIndex } from "../pages/Admin/AdminIndex";
import { Login } from "../pages/Auth/Login";
import { Register } from "../pages/Auth/Register";
import { ProtectedRoute } from "../components/ProtectedRoute/ProtectedRoute";
import { PublicRoute } from "../components/PublicRoute/PublicRoute";
import { IndexScrap } from "../pages/Scrap/Index";
import { AdminLinesIndex } from "../pages/AdminLines/AdminLinesIndex";
import { AdminClients } from "../pages/AdminClients/AdminClients";
import { AdminDefects } from "../pages/AdminDefects/AdminDefects";
import { AdminUser } from "../pages/AdminUser/AdminUser";
import { AdminDefectCondition } from "../pages/AdminDefectCondition/AdminDefectCondition";

export const MyRoutes = () => {
    return (
        <>
            <Routes>

                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                <Route element={<ProtectedRoute />}>
                    {/* Register */}
                    <Route path="/register" element={<Register />} />

                    {/* Admin */}
                    <Route path="/administrador" element={<AdminIndex />} />
                    <Route path="/administrador-lineas" element={<AdminLinesIndex />} />
                    <Route path="/administrador-clientes" element={<AdminClients />} />
                    <Route path="/administrador-defectos" element={<AdminDefects />} />
                    <Route path="/administrador-usuarios" element={<AdminUser />} />
                    <Route path="/administrador-defectos-condicion" element={<AdminDefectCondition />} />

                    {/* Rejections */}
                    <Route path="/" element={<RejectionIndex />} />

                    {/* Scrap */}
                    <Route path="/scrap" element={<IndexScrap />} />

                    {/* ProcessAudit */}
                    <Route path="/auditoria-procesos-productivos" element={<ProcessAudit />} />

                    {/* ProductAudit */}
                    <Route path="/auditoria-producto-terminado" element={<ProductAudit />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    )
}
