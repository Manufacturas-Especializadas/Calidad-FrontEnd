import { Navigate, Route, Routes } from "react-router";
import { RejectionIndex } from "../pages/Rejections/RejectionIndex";
import { ProcessAudit } from "../pages/ProcessAudit/ProcessAudit";
import { ProductAudit } from "../pages/ProductAudit/ProductAudit";
import { AdminIndex } from "../pages/Admin/AdminIndex";
import { Login } from "../pages/Auth/Login";
import { Register } from "../pages/Auth/Register";
import { ProtectedRoute } from "../components/ProtectedRoute/ProtectedRoute";
import { PublicRoute } from "../components/PublicRoute/PublicRoute";

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

                    {/* Rejections */}
                    <Route path="/" element={<RejectionIndex />} />

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
