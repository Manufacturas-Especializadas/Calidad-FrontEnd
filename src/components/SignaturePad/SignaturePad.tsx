import type React from "react";
import { useEffect, useRef } from "react";
import SignaturePads from "react-signature-canvas";

interface Props {
    onSignatureChange: (signatureBase64: string) => void;
    initialData?: string;
    label?: string;
}

export const SignaturePad: React.FC<Props> = ({
    onSignatureChange,
    initialData,
    label = "Firma"
}) => {
    const signatureRef = useRef<any>(null);

    const clear = () => {
        if (signatureRef.current) {
            signatureRef.current.clear();
            onSignatureChange("");
        }
    };

    const saveSignature = () => {
        if (signatureRef.current) {
            const signatureData = signatureRef.current.toDataURL();
            onSignatureChange(signatureData);
        }
    };

    useEffect(() => {
        if (initialData && signatureRef.current) {
            signatureRef.current.fromDataURL(initialData);
        }
    }, [initialData]);

    return (
        <>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <div className="relative border-2 border-gray-300 rounded-lg p-2 bg-white">
                    <div className="h-40 md:h-48 lg:h-52 border-b border-gray-200 mb-2">
                        <SignaturePads
                            ref={signatureRef}
                            canvasProps={{
                                className: "w-full h-full cursor-crosshair",
                                style: { maxWidth: "100%", height: "auto" },
                            }}
                            onEnd={saveSignature}
                            penColor="black"
                            backgroundColor="white"
                            minWidth={0.5}
                            maxWidth={2.5}
                        />
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={clear}
                            className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors hover:cursor-pointer"
                        >
                            Limpiar
                        </button>
                    </div>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                    Dibuja tu firma con el mouse o dedo, luego haz clic en "Guardar firma".
                </p>
            </div>
        </>
    )
}
