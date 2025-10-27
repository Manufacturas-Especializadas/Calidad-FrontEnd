import { OffCanvas } from "../../components/OffCanvas/OffCanvas";
import { rejectionService } from "../../api/services/RejectionService";
import { Button } from "../../components/Button/Button";
import Swal from "sweetalert2";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import type { Rejections } from "../../interfaces/Rejections";
import { FaFileExcel, FaWhatsapp } from "react-icons/fa";
import { PiMicrosoftOutlookLogoFill } from "react-icons/pi";
import { useAuth } from "../../context/AuthContext";
import { RoleGuard } from "../../components/RoleGuard/RoleGuard";
import { useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { FormRejection } from "../../components/FormRejection/FormRejection";

export const RejectionIndex = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [rejection, setRejection] = useState<Rejections[]>([]);
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [tablekey, setTableKey] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const itemsPerPage = 5;

    const totalPage = Math.ceil(rejection.length / itemsPerPage);
    const currentItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return rejection.slice(startIndex, startIndex + itemsPerPage);
    }, [rejection, currentPage, itemsPerPage]);


    const handleOpenOffcanvas = () => setIsOffcanvasOpen(true);
    const handleCloseOffcanvas = () => setIsOffcanvasOpen(false);

    const loadRejection = async () => {
        try {
            const data = await rejectionService.getRejections();
            setRejection(data || []);
        } catch (error: any) {
            console.error("Error al obtener la lista: ", error);
            setError("No se pudo cargar la lista de rechazos. Inténtalo de nuevo.");
            setRejection([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRejection();
    }, [tablekey]);

    const renderFirstImage = (imageString: string | null | undefined): React.ReactNode => {
        if (!imageString || !imageString.trim()) {
            return <span className="text-gray-400">Sin evidencia</span>
        }

        const firstUrl = imageString.split(';')[0]?.trim();

        if (!firstUrl) {
            return <span className="text-gray-400">Sin evidencia</span>
        }

        return (
            <img
                src={firstUrl}
                alt="Rechazo"
                className="h-20 w-20 object-cover rounded-full border border-gray-200"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = "Sin evidencia";
                }}
            />
        )
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "-";
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };;

    const sendToWhatsApp = (rejectionItem: Rejections) => {
        const {
            partNumber,
            defects: defectName,
            condition: conditionName,
            description,
            numberOfPieces,
            lines: lineName,
            clients: clientName,
            operatorPayroll,
            image,
            registrationDate
        } = rejectionItem;

        const date = new Date(registrationDate);
        const formattedDate = isNaN(date.getTime())
            ? "Fecha no disponible"
            : date.toLocaleDateString("es-MX", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });


        const imageUrls = image && typeof image === "string"
            ? image.split(";").filter(url => url.trim() !== "")
            : [];

        let evidenceText = "";
        if (imageUrls.length > 0) {
            const firstImage = imageUrls[0];
            evidenceText = `\n📸 *Evidencia:* ${firstImage}`;
            evidenceText = imageUrls.map((url, i) => `\n📸 *Foto ${i + 1}:* ${url}`).join('');
        } else {
            evidenceText = "\n📸 *Evidencia:* No disponible";
        }
        const message = `Buen día, reporte de rechazo interno ${formattedDate}
            📄 *Número de parte:* ${partNumber || "—"}
            🧩 *Defecto:* ${defectName || "—"}
            🔍 *Condición:* ${conditionName || "—"}
            🏭 *Línea:* ${lineName || "—"}
            🏭 *Cliente:* ${clientName || "—"}
            👤 *Nómina operador:* ${operatorPayroll || "—"}
            🔢 *Piezas rechazadas:* ${numberOfPieces || 0}
            📝 *Descripción:* ${description || "Sin descripción"}${evidenceText}
            Saludos.`.trim();

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://web.whatsapp.com/send?text=${encodedMessage}`;

        const newWindow = window.open(whatsappUrl, '_blank');
        if (newWindow) {
            newWindow.focus();
        } else {
            Swal.fire({
                title: "Ventana emergente bloqueada",
                text: "Por favor, permite las ventanas emergentes para compartir en WhatsApp",
                icon: "warning",
                confirmButtonText: "Entendido"
            });
        }
    };

    const sendToOutlook = (rejectionItem: Rejections) => {
        const {
            partNumber,
            defects: defectName,
            condition: conditionName,
            description,
            numberOfPieces,
            lines: lineName,
            clients: clientName,
            operatorPayroll,
            image,
            registrationDate
        } = rejectionItem;

        const date = new Date(registrationDate);
        const formattedDate = isNaN(date.getTime())
            ? "Fecha no disponible"
            : date.toLocaleDateString("es-MX", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });

        const subject = `Reporte de rechazo interno - ${formattedDate}`;

        const imageUrls = image && typeof image === 'string'
            ? image.split(';').filter(url => url.trim() !== '')
            : [];

        let evidenceText = "";
        if (imageUrls.length > 0) {
            const firstImage = imageUrls[0];
            evidenceText = `\nEvidencia: ${firstImage}`;
            evidenceText = imageUrls.map((url, i) => `\nFoto ${i + 1}: ${url}`).join('');
        } else {
            evidenceText = "\nEvidencia: No disponible";
        }

        const body = `Buen día, reporte de rechazo interno ${formattedDate}

        Número de parte: ${partNumber || "—"}
        Defecto: ${defectName || "—"}
        Condición: ${conditionName || "—"}
        Línea: ${lineName || "—"}
        Cliente: ${clientName || "—"}
        Nómina operador: ${operatorPayroll || "—"}
        Piezas rechazadas: ${numberOfPieces || 0}
        Descripción: ${description || "Sin descripción"}${evidenceText}

        Saludos.`;

        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(body);
        const mailtoUrl = `mailto:?subject=${encodedSubject}&body=${encodedBody}`;

        window.location.href = mailtoUrl;
    };

    const handleViewDetails = (item: Rejections) => {
        const formattedDate = (date: string) => {
            if (!date) return "-";
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) return "Fecha inválida";
            const day = String(parsedDate.getDate()).padStart(2, "0");
            const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
            const year = parsedDate.getFullYear();
            return `${day}/${month}/${year}`;
        };

        Swal.fire({
            title: `DETALLES DE RECHAZO`,
            html: `
            <div style="text-align: left; line-height: 1.6; font-size: 14px;">
                <p><strong>Fecha:</strong> ${formattedDate(item.registrationDate)}</p>
                <p><strong>Inspector:</strong> ${item.insepector || '—'}</p>
                <p><strong>Número de parte:</strong> ${item.partNumber || '—'}</p>
                <p><strong>Cantidad:</strong> ${item.numberOfPieces || '—'}</p>
                <p><strong>Defecto:</strong> ${item.defects || '—'}</p>
                <p><strong>Condición:</strong> ${item.condition || '—'}</p>
                <p><strong>Cliente:</strong> ${item.clients || '—'}</p>
                <p><strong>Línea:</strong> ${item.lines || '—'}</p>
                <p><strong>Nómina operador:</strong> ${item.operatorPayroll || '—'}</p>
                <p><strong>Descripción:</strong> ${item.description || '—'}</p>
                <p><strong>Folio:</strong> ${item.folio || '—'}</p>
            </div>
        `,
            confirmButtonText: "Cerrar",
            icon: "info"
        });
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

    const handleSuccess = () => {
        handleCloseOffcanvas();
        setTableKey(prev => prev + 1);
    };

    const handleRetry = () => {
        setError(null);
        setLoading(true);
        loadRejection();
    };


    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">No estás autenticado. Redirigiendo...</div>;
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="flex justify-between mb-4">
                    <RoleGuard allowedRoles={["Admin", "Ingeniero"]}>
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
                    </RoleGuard>
                    <RoleGuard allowedRoles={["Admin"]}>
                        <Button variant="primary" size="sm" onClick={() => navigate("/administrador")}>
                            Admin
                        </Button>
                    </RoleGuard>
                    <Button variant="primary" size="sm" onClick={handleOpenOffcanvas}>
                        Registrar rechazo
                    </Button>
                </div>

                <ErrorBoundary fallback={<div className="text-center text-red-500 p-8">Ocurrio un error inesperado. Por favor recarga la página</div>}>
                    <div className="bg-white rounded-lg shadow-md p-4">
                        {
                            loading ? (
                                <div className="py-12 text-center text-gray-500">
                                    Cargando datos...
                                </div>
                            ) : error ? (
                                <div className="py-12 text-center">
                                    <div className="text-red-500 font-medium mb-2">
                                        {error}
                                    </div>
                                    <Button variant="secondary" size="sm" onClick={handleRetry}>
                                        Reintentar
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-5">
                                        {currentItems.map((item) => {
                                            const isAdmin = user?.role?.includes("Admin") || user?.role === "Admin";

                                            return (
                                                <article
                                                    key={item.id}
                                                    className={`group relative rounded-xl border border-gray-200 bg-white p-5 
                                                    shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300
                                                    ${isAdmin ? "cursor-pointer hover:bg-gray-50" : ""}`}
                                                    onClick={(e) => {
                                                        if (isAdmin) {
                                                            e.stopPropagation();
                                                            handleViewDetails(item);
                                                        }
                                                    }}
                                                >
                                                    <time className="block text-xs font-medium text-gray-500 mb-3">
                                                        {formatDate(item.registrationDate)}
                                                    </time>

                                                    <div className="flex flex-col sm:flex-row gap-4">
                                                        <div className="flex-shrink-0 w-16 h-16 rounded-lg 
                                                            overflow-hidden bg-gray-100 flex items-center justify-center">
                                                            {renderFirstImage(item.image) || (
                                                                <span className="text-gray-400 text-sm">Sin imagen</span>
                                                            )}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-relaxed line-clamp-2">
                                                                {item.description}
                                                            </h3>
                                                        </div>

                                                        <div className="flex gap-2 mt-2 sm:mt-0 sm:ml-auto">
                                                            <RoleGuard allowedRoles={["Admin", "Ingeniero"]}>
                                                                <button
                                                                    aria-label="Enviar por WhatsApp"
                                                                    className="flex items-center justify-center w-10 h-10 rounded-lg 
                                                                    bg-green-50 text-green-600 hover:bg-green-100 transition-colors 
                                                                    focus:outline-none focus:ring-2 focus:ring-green-300"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        sendToWhatsApp(item);
                                                                    }}
                                                                >
                                                                    <FaWhatsapp className="text-lg" />
                                                                </button>
                                                                <button
                                                                    aria-label="Enviar por Outlook"
                                                                    className="flex items-center justify-center w-10 h-10 rounded-lg 
                                                                    bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors 
                                                                    focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        sendToOutlook(item);
                                                                    }}
                                                                >
                                                                    <PiMicrosoftOutlookLogoFill className="text-lg" />
                                                                </button>
                                                            </RoleGuard>
                                                        </div>
                                                    </div>
                                                </article>
                                            );
                                        })}
                                    </div>

                                    {totalPage > 1 && (
                                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                                            <button
                                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 
                                                bg-white border border-gray-300 rounded-lg hover:bg-gray-50 
                                                disabled:opacity-50 disabled:cursor-not-allowed transition-colors 
                                                focus:outline-none focus:ring-2 focus:ring-gray-300 hover:cursor-pointer"
                                            >
                                                Anterior
                                            </button>

                                            <span className="text-sm font-medium text-gray-600 px-2">
                                                Página <span className="font-semibold">{currentPage}</span> de {totalPage}
                                            </span>

                                            <button
                                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPage))}
                                                disabled={currentPage === totalPage}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white 
                                                border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 
                                                disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 
                                                focus:ring-gray-300 hover:cursor-pointer"
                                            >
                                                Siguiente
                                            </button>
                                        </div>
                                    )}
                                </>
                            )
                        }
                    </div>

                    <OffCanvas
                        title="Registar rechazo"
                        isOpen={isOffcanvasOpen}
                        onClose={handleCloseOffcanvas}
                    >
                        <FormRejection onSuccess={handleSuccess} />
                    </OffCanvas>
                </ErrorBoundary>
            </div>
        </>
    )
}