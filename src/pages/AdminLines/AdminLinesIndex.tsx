import { useEffect, useState } from "react";
import { Table } from "../../components/Table/Table";
import type { Lines } from "../../interfaces/Lines";
import { linesService } from "../../api/services/LinesService";
import Swal from "sweetalert2";
import { OffCanvas } from "../../components/OffCanvas/OffCanvas";
import { FormLine } from "../../components/FormLine/FormLine";
import { Button } from "../../components/Button/Button";
import { useNavigate } from "react-router";

export const AdminLinesIndex = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lines, setLines] = useState<Lines[]>([]);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [isOffCanvaOpen, setIsOffCanvaOpen] = useState(false);
    const [tablekey, setTableKey] = useState(0);
    const [editingLineId, setEditingLineId] = useState<number | null>(null);
    const navigate = useNavigate();

    const handleOpenOffCanvas = () => setIsOffCanvaOpen(true);
    const handleCloseOffCanvas = () => {
        setIsOffCanvaOpen(false);
        setEditingLineId(null);
    };

    const getLines = async () => {
        try {
            const data = await linesService.getLines();
            setLines(data);
            setError(null);
        } catch (error: any) {
            console.error("Error loading lines: ", error);
            setLines([]);
        } finally {
            setLoading(false);
        };
    };

    useEffect(() => {
        getLines();
    }, [tablekey]);

    const handleEdit = (line: Lines) => {
        setEditingLineId(line.id);
        setIsOffCanvaOpen(true);
    };

    const handleDelete = async (row: Lines) => {
        const result = await Swal.fire({
            title: "¿Estas seguro?",
            text: "Vas a eliminar una linea",
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
            const response = await linesService.deleteLine(row.id);

            if (response.success) {
                setLines(lines.filter(line => line.id !== row.id));

                Swal.fire({
                    title: "¡Eliminado!",
                    text: "La linea ha sido eliminada correctamente",
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

    const handleSuccess = () => {
        handleCloseOffCanvas();
        setTableKey(prev => prev + 1);
    };

    const columns = [
        {
            name: "Nombre de la linea",
            selector: (row: Lines) => row.name
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
                            Gestiona las lineas de tu plataforma
                        </p>
                    </header>

                    <div className="mb-4 flex justify-evenly">
                        <Button variant="secondary" size="sm" onClick={() => navigate("/administrador")}>
                            REGRESAR
                        </Button>
                        <Button variant="secondary" size="sm" onClick={handleOpenOffCanvas}>
                            REGISTRA NUEVA LINEA
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
                                <Table<Lines>
                                    columns={columns}
                                    data={lines}
                                    onDelete={handleDelete}
                                    onEdit={handleEdit}
                                    actionLoading={actionLoading}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <OffCanvas
                title="REGISTRO DE LINEAS"
                isOpen={isOffCanvaOpen}
                onClose={handleCloseOffCanvas}
            >
                <FormLine onSuccess={handleSuccess} lineId={editingLineId ?? undefined} />
            </OffCanvas>
        </>
    )
}
