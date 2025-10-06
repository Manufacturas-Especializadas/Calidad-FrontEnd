import type React from "react";
import { Button } from "../Button/Button";
import type { Scrap } from "../../interfaces/Scrap";
import { FaRecycle, FaExclamationTriangle, FaRedo, FaWeightHanging, FaIndustry } from "react-icons/fa";
import { useEffect } from "react";

interface Props {
    loading: boolean;
    error: string | null;
    onRetry: () => void;
    data: Scrap[] | null;
    reloadTrigger?: number
}

const ScrapList: React.FC<Props> = ({
    loading,
    error,
    onRetry,
    data,
    reloadTrigger
}) => {

    useEffect(() => {
        if (reloadTrigger !== undefined) {
            onRetry();
        }
    }, [reloadTrigger]);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 flex flex-col items-center justify-center min-h-[220px]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600 mb-3"></div>
                <p className="text-gray-600 font-medium">Cargando registros de scrap...</p>
            </div>
        );
    };

    if (error) {
        return (
            <div className="bg-red-50 rounded-2xl shadow-md border border-red-200 p-8 text-center">
                <FaExclamationTriangle className="text-red-500 text-3xl mx-auto mb-3" />
                <p className="text-red-600 font-semibold mb-4">{error}</p>
                <Button variant="primary" size="sm" onClick={onRetry} className="flex items-center gap-2 mx-auto">
                    <FaRedo /> Reintentar
                </Button>
            </div>
        );
    };

    if (!data || data.length === 0) {
        return (
            <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                <FaRecycle className="text-gray-400 text-4xl mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No se encontraron registros de scrap</p>
            </div>
        )
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all">
                <ul className="divide-y divide-gray-100">
                    {data.map((item) => (
                        <li
                            key={item.id}
                            className="p-4 sm:p-6 hover:bg-blue-50 transition-all duration-200 group"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left items-center">
                                <div className="flex flex-col items-center sm:items-start">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Línea</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <FaIndustry className="text-blue-500 group-hover:scale-110 transition-transform" />
                                        <p className="font-semibold text-gray-800">{item.line || "-"}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center sm:items-start">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Tipo Scrap</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <FaRecycle className="text-green-500 group-hover:rotate-12 transition-transform" />
                                        <p className="font-medium text-gray-800">{item.typeScrap || "-"}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center sm:items-end">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Kilos</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <FaWeightHanging className="text-emerald-600 group-hover:scale-110 transition-transform" />
                                        <p className="font-semibold text-emerald-700">{item.kg || "-"}</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default ScrapList