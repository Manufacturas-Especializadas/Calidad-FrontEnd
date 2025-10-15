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
