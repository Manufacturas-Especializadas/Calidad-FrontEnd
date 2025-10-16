import { useEffect, useState } from "react";
import { Button } from "../../components/Button/Button";
import { Table } from "../../components/Table/Table";
import type { Defects } from "../../interfaces/Defects";
import { defectsService } from "../../api/services/DefectsService";
import { useNavigate } from "react-router";
import { OffCanvas } from "../../components/OffCanvas/OffCanvas";
import { FormDefect } from "../../components/FormDefect/FormDefect";
import Swal from "sweetalert2";

export const AdminDefects = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [defect, setDefect] = useState<Defects[]>([]);
    const [tablekey, setTableKey] = useState(0);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [isOffCanvaOpen, setIsOffCanvaOpen] = useState(false);
    const [editingDefectId, setEditingDefectId] = useState<number | null>(null);

    const navigate = useNavigate();

    const handleOpenOffCanvas = () => setIsOffCanvaOpen(true);
    const handleCloseOffCanvas = () => {
        setIsOffCanvaOpen(false);
        setEditingDefectId(null);
    }

    const getDefects = async () => {
        try {
            const data = await defectsService.getDefects();
            setDefect(data);
            setError(null);
        } catch (error: any) {
            console.error("Error loading defects: ", error);
            setDefect([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDefects();
    }, [tablekey]);

    const handleEdit = (defect: Defects) => {
        setEditingDefectId(defect.id);
        setIsOffCanvaOpen(true);
    };

    const handleSuccess = () => {
        handleCloseOffCanvas();
        setTableKey(prev => prev + 1);
    };

    const handleDelete = async (row: Defects) => {
        const result = await Swal.fire({
            title: "¿Estas seguro?",
            text: "Vas a eliminar este defecto",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar"
        });


        if (!result.isConfirmed) {
            return;
        }

        setActionLoading(row.id);

        try {
            const response = await defectsService.deleteDefect(row.id);

            if (response.success) {
                setDefect(defect.filter(defect => defect.id !== row.id));

                Swal.fire({
                    title: "¡Eliminado!",
                    text: "El defecto ha sido eliminado correctamente",
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
                text: "Hubo un problema al comunicarse con el servidor",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        } finally {
            setActionLoading(null);
        }
    };

    const columns = [
        {
            name: "Nombre del defecto",
            selector: (row: Defects) => row.name
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
                            Gestiona los defectos de tu plataforma
                        </p>
                    </header>

                    <div className="mb-4 flex justify-evenly">
                        <Button variant="secondary" size="sm" onClick={() => navigate("/administrador")}>
                            REGRESAR
                        </Button>
                        <Button variant="secondary" size="sm" onClick={handleOpenOffCanvas}>
                            REGISTRAR NUEVO DEFECTO
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
                                <Table<Defects>
                                    columns={columns}
                                    data={defect}
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
                title="REGISTRO DEFECTO"
                isOpen={isOffCanvaOpen}
                onClose={handleCloseOffCanvas}
            >
                <FormDefect onSuccess={handleSuccess} defectId={editingDefectId ?? undefined} />
            </OffCanvas>
        </>
    );
};