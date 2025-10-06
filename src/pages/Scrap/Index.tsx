import { useEffect, useState } from "react";
import { Button } from "../../components/Button/Button";
import ScrapList from "../../components/ScrapList/ScrapList";
import { OffCanvas } from "../../components/OffCanvas/OffCanvas";
import { FormScrap } from "../../components/FormScrap/FormScrap";
import type { Scrap } from "../../interfaces/Scrap";
import { scrapService } from "../../api/services/ScrapService";

export const IndexScrap = () => {
    const [isOffCanvaOpen, setIsOffCanvaOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [scrap, setScrap] = useState<Scrap[]>([]);

    const handleOpenOffCanvas = () => setIsOffCanvaOpen(true);
    const handleCloseOffCanvas = () => setIsOffCanvaOpen(false);


    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await scrapService.getScrap();
            setScrap(data);
        } catch (err: any) {
            console.error("Error al obtener la data", err);
            setError("No se pudieron cargar los registros");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="flex justify-end mb-6">
                    <Button variant="primary" size="sm" onClick={handleOpenOffCanvas}>
                        REGISTRAR SCRAP
                    </Button>
                </div>

                <ScrapList
                    loading={loading}
                    error={error}
                    onRetry={loadData}
                    data={scrap}
                />

                <OffCanvas
                    title="REGISTRO DE SCRAP"
                    isOpen={isOffCanvaOpen}
                    onClose={handleCloseOffCanvas}
                >
                    <FormScrap />
                </OffCanvas>
            </div>
        </>
    );
};