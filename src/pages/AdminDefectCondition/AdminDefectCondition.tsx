import { useEffect, useState } from "react";
import { Button } from "../../components/Button/Button";
import { Table } from "../../components/Table/Table";
import type { DefectCondition } from "../../interfaces/DefectCondition";
import { defectConditionService } from "../../api/services/DefectCondiontionService";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { OffCanvas } from "../../components/OffCanvas/OffCanvas";
import { FormDefectCondition } from "../../components/FormDefectCondition/FormDefectCondition";

export const AdminDefectCondition = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tablekey, setTableKey] = useState(0);
    const [isOffCanvaOpen, setIsOffCanvaOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [editingConditionId, setEditingConditionId] = useState<number | null>(null);
    const [defectCondition, setDefectCondition] = useState<DefectCondition[]>([]);
    const navigate = useNavigate();

    const handleOpenOffCanvas = () => setIsOffCanvaOpen(true);
    const handleCloseOffCanvas = () => {
        setIsOffCanvaOpen(false);
        setEditingConditionId(null);
    };

    const getDefectCondition = async () => {
        try {
            const data = await defectConditionService.getDefectCondition();
            setDefectCondition(data);
            setError(null);
        } catch (error: any) {
            console.error("Error loading defect condition: ", error);
            setDefectCondition([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDefectCondition();
    }, [tablekey]);

    const handleDelete = async (row: DefectCondition) => {
        const result = await Swal.fire({
            title: "¿Estas seguro?",
            text: "Vas a eliminar esta condición",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            cancelButtonText: "Cancelar"
        });

        if (!result.isConfirmed) {
            return;
        }

        setActionLoading(row.id);

        try {
            const response = await defectConditionService.deleteDefectCondition(row.id);

            if (response.success) {
                setDefectCondition(defectCondition.filter(defect => defect.id !== row.id));

                Swal.fire({
                    title: "¡Eliminado!",
                    text: "La condicion ha sido eliminada correctamente",
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: response.message || "No se pudo eliminar",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
            }
        } catch (error: any) {
            console.error("Error al eliminar: ", error);
            Swal.fire({
                title: "Error",
                text: "Hubo un problem al comunicarse con el servidor",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        } finally {
            setActionLoading(null);
        }
    };

    const handleSuccess = () => {
        handleCloseOffCanvas();
        setTableKey(prev => prev + 1);
    };

    const handleEdit = (condition: DefectCondition) => {
        setEditingConditionId(condition.id);
        setIsOffCanvaOpen(true);
    };

    const columns = [
        {
            name: "Defecto",
            selector: (row: DefectCondition) => row.defecto
        },
        {
            name: "Condición",
            selector: (row: DefectCondition) => row.name
        }
    ];

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-4 md:p-6">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-6 md:mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Panel de administración
                        </h1>
                        <p className="mt-1 text-sm md:text-base text-gray-600">
                            Gestiona las condicions de los defectos
                        </p>
                    </header>

                    <div className="mb-4 flex justify-evenly">
                        <Button variant="secondary" size="sm" onClick={() => navigate("/administrador")}>
                            REGRESAR
                        </Button>
                        <Button variant="secondary" size="sm" onClick={handleOpenOffCanvas}>
                            REGISTRAR NUEVA CONDICIÓN
                        </Button>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 md:p-6">
                            {loading ? (
                                <div className="py-12 text-center">
                                    Cargando datos...
                                </div>
                            ) : error ? (
                                <div className="py-12 text-center">
                                    <div className="text-red-500 font-medium mb-2">{error}</div>
                                    <button className="bg-primary text-white px-4 py-2 rounded-md
                                        hover:bg-secondary transition-all hover:cursor-pointer">
                                        Reintentar
                                    </button>
                                </div>
                            ) : (
                                <Table<DefectCondition>
                                    columns={columns}
                                    data={defectCondition}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    actionLoading={actionLoading}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <OffCanvas
                title="CONDICIÓN"
                isOpen={isOffCanvaOpen}
                onClose={handleCloseOffCanvas}
            >
                <FormDefectCondition onSuccess={handleSuccess} defectId={editingConditionId ?? undefined} />
            </OffCanvas>
        </>
    )
}