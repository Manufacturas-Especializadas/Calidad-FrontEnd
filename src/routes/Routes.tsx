import { Route, Routes } from "react-router";
import { RejectionIndex } from "../pages/Rejections/RejectionIndex";
import { ProcessAudit } from "../pages/ProcessAudit/ProcessAudit";
import { ProductAudit } from "../pages/ProductAudit/ProductAudit";

export const MyRoutes = () => {
    return (
        <>
            <Routes>

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
