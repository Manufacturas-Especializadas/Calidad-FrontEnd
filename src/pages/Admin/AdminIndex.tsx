import { useEffect, useState } from "react";
import type { Rejections } from "../../interfaces/Rejections";
import { rejectionService } from "../../api/services/RejectionService";
import { Table } from "../../components/Table/Table";
import Swal from "sweetalert2";
import { FaFileExcel } from "react-icons/fa";
import { useNavigate } from "react-router";
import { OffCanvas } from "../../components/OffCanvas/OffCanvas";
import { FormRejection } from "../../components/FormRejection/FormRejection";
import { Button } from "../../components/Button/Button";


export const AdminIndex = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [rejection, setRejection] = useState<Rejections[]>([]);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const [selectedRejectionId, setSelectedRejectionId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadRejection = async () => {
            try {
                const data = await rejectionService.getRejections();
                setRejection(data);
                setError(null);
            } catch (error: any) {
                console.error("Error loading rejections: ", error);
            } finally {
                setLoading(false);
            }
        };
        loadRejection();
    }, []);

    const handleView = (row: Rejections) => {
        Swal.fire({
            title: `DETALLES DE RECHAZO`,
            html: `
                <div style="text-align: left; line-height: 1.6; font-size: 14px;">
                    <p><strong>Fecha:</strong> ${formattedDate(row.registrationDate)}</p>
                    <p><strong>Inspector:</strong> ${row.insepector || '—'}</p>
                    <p><strong>Número de parte:</strong> ${row.partNumber || '—'}</p>
                    <p><strong>Cantidad:</strong> ${row.numberOfPieces || '—'}</p>
                    <p><strong>Defecto:</strong> ${row.defects || '—'}</p>
                    <p><strong>Condición:</strong> ${row.condition || '—'}</p>
                    <p><strong>Cliente:</strong> ${row.clients || '-'}</p>
                    <p><strong>Descripción:</strong> ${row.description || '—'}</p>
                    <p><strong>Folio:</strong> ${row.folio}</p>
                </div>
            `,
        });
    };

    const handleDelete = async (row: Rejections) => {
        const result = await Swal.fire({
            title: "¿Estas seguro?",
            text: `Vas eliminar el rechazo de: ${row.insepector}`,
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
            const response = await rejectionService.deleteReject(row.id);
            if (response.success) {
                setRejection(rejection.filter(rejection => rejection.id !== row.id));

                Swal.fire({
                    title: "¡Eliminado!",
                    text: "El rechazo ha sido eliminado correctamente",
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: response.message || "No se pudo eliminar el rechazo",
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

    const handleDownloadExcel = async () => {
        if (downloadLoading) return;

        setDownloadLoading(true);

        try {
            Swal.fire({
                title: "Generando reporte...",
                html: "Esto puede tardar unos segundos.",
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const blob = await rejectionService.downloadExcel();

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `rechazos_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            Swal.fire({
                title: "¡Listo!",
                text: "El archivo se ha descargado correctamente.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error("Error al descargar Excel:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo generar el archivo. Verifica tu conexión o intenta más tarde.",
                icon: "error"
            });
        } finally {
            setDownloadLoading(false);
        }
    };

    const formattedDate = (date: string) => {
        if (!date) return "-";

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) return "Fecha inválida";

        const day = String(parsedDate.getDate()).padStart(2, "0");
        const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
        const year = parsedDate.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const handleCloseOffcanvas = () => {
        setIsOffcanvasOpen(false);
        setSelectedRejectionId(null);
    };

    const handleEdit = (row: Rejections) => {
        setSelectedRejectionId(row.id);
        setIsOffcanvasOpen(true);
    };

    const handleSuccess = () => {
        handleCloseOffcanvas();
        rejectionService.getRejections().then(data => setRejection(data));
    };


    const columns = [
        {
            name: "Fecha",
            selector: (row: Rejections) => formattedDate(row.registrationDate)
        },
        {
            name: "Inspector",
            selector: (row: Rejections) => row.insepector
        },
        {
            name: "Número de parte",
            selector: (row: Rejections) => row.partNumber
        },
        {
            name: "Cantidad",
            selector: (row: Rejections) => row.numberOfPieces
        },
        {
            name: "Defecto",
            selector: (row: Rejections) => row.defects
        },
        {
            name: "Condición",
            selector: (row: Rejections) => row.condition
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
                            Gestiona los recursos de tu plataforma
                        </p>
                    </header>

                    <div className="mb-4 flex justify-between">
                        <Button variant="secondary" size="sm" onClick={() => navigate("/administrador-lineas")}>
                            Administar Lineas
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => navigate("/administrador-clientes")}>
                            Administra Clientes
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => navigate("/administrador-defectos")}>
                            Administra Defectos
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => navigate("/administrador-defectos-condicion")}>
                            Administra Condición de Defectos
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => navigate("/administrador-usuarios")}>
                            Usuarios
                        </Button>
                        <button
                            onClick={handleDownloadExcel}
                            disabled={loading || rejection.length === 0}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium transition-all ${loading || rejection.length === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                                } hover:cursor-pointer`}
                            aria-label="Descargar en Excel"
                        >
                            <FaFileExcel className="text-xl" />
                            <span>Exportar a Excel</span>
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 md:p-6">
                            {loading ? (
                                <div className="py-12 text-center text-gray-500">
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
                                <Table<Rejections>
                                    columns={columns}
                                    data={rejection}
                                    onView={handleView}
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
                title={selectedRejectionId ? "Editar rechazo" : "Registrar rechazo"}
                isOpen={isOffcanvasOpen}
                onClose={handleCloseOffcanvas}
            >
                <FormRejection
                    onSuccess={handleSuccess}
                    rejectionId={selectedRejectionId ?? undefined}
                />
            </OffCanvas>

        </>
    )
}