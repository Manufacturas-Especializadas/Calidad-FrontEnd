import { Route, Routes } from "react-router";
import { RejectionIndex } from "../pages/Rejections/RejectionIndex";
import { ProcessAudit } from "../pages/ProcessAudit/ProcessAudit";
import { ProductAudit } from "../pages/ProductAudit/ProductAudit";
import { AdminIndex } from "../pages/Admin/AdminIndex";
import { Login } from "../pages/Auth/Login";
import { Register } from "../pages/Auth/Register";

export const MyRoutes = () => {
    return (
        <>
            <Routes>
                {/* Login and register */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Admin */}
                <Route path="/administrador" element={<AdminIndex />} />

                {/* Rejections */}
                <Route path="/" element={<RejectionIndex />} />

                {/* ProcessAudit */}
                <Route path="/auditoria-procesos-productivos" element={<ProcessAudit />} />

                {/* ProductAudit */}
                <Route path="/auditoria-producto-terminado" element={<ProductAudit />} />
            </Routes>
        </>
    )
}
