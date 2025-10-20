import React, { useEffect, useState } from "react";
import { SignaturePad } from "../../components/SignaturePad/SignaturePad";
import { FormInput } from "../../components/FormInput/FormInput";
import { rejectionService, type RejectionFormData } from "../../api/services/RejectionService";
import type { Defects } from "../../interfaces/Defects";
import type { Condition } from "../../interfaces/Condition";
import type { Lines } from "../../interfaces/Lines";
import type { Clients } from "../../interfaces/Clients";
import type { Actions } from "../../interfaces/Actions";
import Swal from "sweetalert2";
import { Button } from "../Button/Button";

interface Props {
    onSuccess?: () => void;
    rejectionId?: number;
}

export const FormRejection = ({ onSuccess, rejectionId }: Props) => {
    const [formData, setFormData] = useState<RejectionFormData>({
        insepector: "",
        partNumber: "",
        numberOfPieces: 0,
        description: "",
        image: "",
        informedSignature: "",
        operatorPayroll: 0,
        registrationDate: new Date().toISOString().split("T")[0],
        folio: 0,
        idDefect: 0,
        idCondition: 0,
        idLine: 0,
        idClient: 0,
        idContainmentaction: 0
    });

    const [defects, setDefects] = useState<Defects[]>([]);
    const [conditions, setConditions] = useState<Condition[]>([]);
    const [lines, setLines] = useState<Lines[]>([]);
    const [clients, setClients] = useState<Clients[]>([]);
    const [actions, setActions] = useState<Actions[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadErrors, setUploadErros] = useState<string[]>([]);
    const [nextFolio, setNextFolio] = useState<number>(0);
    const [loadingFolio, setLoadingFolio] = useState(false);
    const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingConditions, setLoadingConditions] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({
        numberOfPieces: "",
        operatorPayroll: ""
    });


    useEffect(() => {
        const loadReject = async () => {
            if (!rejectionId) {
                setIsEditing(false);
                return;
            }

            setIsEditing(true);

            try {
                const rejection = await rejectionService.getRejectionById(rejectionId);

                if (rejection.idDefect) {
                    const data = await rejectionService.getConditionByDefect(rejection.idDefect);
                    setConditions(data || []);
                }

                if (rejection.image) {
                    const urls = rejection.image.split(';').filter(url => url);
                    setExistingImageUrls(urls);
                };

                setFormData({
                    insepector: rejection.insepector,
                    partNumber: rejection.partNumber,
                    numberOfPieces: rejection.numberOfPieces,
                    description: rejection.description,
                    image: rejection.image,
                    informedSignature: rejection.informedSignature,
                    operatorPayroll: rejection.operatorPayroll,
                    registrationDate: rejection.registrationDate || new Date().toISOString().split("T")[0],
                    folio: rejection.folio,
                    idDefect: rejection.idDefect,
                    idCondition: rejection.idCondition,
                    idLine: rejection.idLine,
                    idClient: rejection.idClient,
                    idContainmentaction: rejection.idContainmentaction
                });
            } catch (error: any) {
                Swal.fire({
                    title: "Error",
                    text: "No se pudo cargar el rechazo",
                    icon: "error"
                });
            }
        };

        loadReject();
    }, [rejectionId]);



    useEffect(() => {
        const loadDefects = async () => {
            try {
                const data = await rejectionService.getDefects();
                setDefects(data || []);
            } catch (error: any) {
                setError("Error al cargar los defectos. Intente nuevamente.")
                console.error("Error loading defects", error);
            } finally {
                setLoading(false);
            }
        };

        loadDefects();
    }, []);

    useEffect(() => {
        const loadConditions = async () => {
            if (formData.idDefect === 0) {
                setConditions([]);

                return;
            }

            setLoadingConditions(true);

            try {
                const data = await rejectionService.getConditionByDefect(formData.idDefect);
                setConditions(data || []);
            } catch (error: any) {
                setError("Error al cargar las condiciones. Intente nuevamente");
                console.error("Error loading conditions: ", error);
                setConditions([]);
            } finally {
                setLoadingConditions(false);
            }
        }
        loadConditions();

    }, [formData.idDefect]);

    useEffect(() => {
        const loadLines = async () => {
            try {
                const data = await rejectionService.getLines();
                setLines(data || []);
            } catch (error: any) {
                setError("Error al cargar las lineas. Intente nuevamente");
                setLines([]);
            }
        }
        loadLines();
    }, []);

    useEffect(() => {
        const loadClients = async () => {
            try {
                const data = await rejectionService.getClients();
                setClients(data || []);
            } catch (error: any) {
                setError("Error al cargar los clientes. Intente nuevamente");
                setClients([]);
            }
        }
        loadClients();
    }, []);

    useEffect(() => {
        const loadActions = async () => {
            try {
                const data = await rejectionService.getActions();
                setActions(data || []);
            } catch (error: any) {
                setError("Error al cargar las acciones. Intente nuevamente");
                setActions([]);
            }
        }
        loadActions();
    }, []);


    useEffect(() => {
        const loadNextFolio = async () => {
            if (!isEditing) {
                setLoadingFolio(true);
                try {
                    const folio = await rejectionService.getNextFolio();
                    setNextFolio(folio);
                    setFormData(prev => ({ ...prev, folio }));
                } catch (error: any) {
                    setError("Error al obtener el folio. Intente nuevamente");
                    console.error("Error loading folio: ", error);
                } finally {
                    setLoadingFolio(false);
                }
            }
        };

        loadNextFolio();
    }, [isEditing]);

    const validateField = (name: string, value: string) => {
        const num = Number(value);

        if (name === 'numberOfPieces' || name === 'operatorPayroll') {
            if (value !== '' && (isNaN(num) || num < 0)) {
                setValidationErrors(prev => ({
                    ...prev,
                    [name]: 'No se aceptan números negativos',
                }));
            } else {
                setValidationErrors(prev => ({
                    ...prev,
                    [name]: '',
                }));
            }
        }
    };

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "idDefect") {
            const defectId = Number(value);
            setFormData(prev => ({ ...prev, idDefect: defectId, idCondition: 0 }));

            if (defectId > 0) {
                const cond = await rejectionService.getConditionByDefect(defectId);
                setConditions(cond);
            } else {
                setConditions([]);
            }
            return;
        }

        if (['numberOfPieces', 'operatorPayroll'].includes(name)) {
            validateField(name, value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: ['numberOfPieces', 'operatorPayroll', 'idCondition', 'idLine', 'idClient', 'idContainmentaction'].includes(name)
                ? Number(value)
                : value,
        }));
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (files.length + selectedFiles.length > 5) {
            setUploadErros(["No puedes subir más de 4 imágenes."]);
            return;
        }

        const validFiles: File[] = [];
        const errors: string[] = [];

        files.forEach(file => {
            if (!file.type.startsWith("image/")) {
                errors.push(`"${file.name}" no es una imagen válida.`);
                return;
            }

            validFiles.push(file);
        });

        if (errors.length > 0) {
            setUploadErros(prev => [...prev, ...errors]);
            return;
        }

        setSelectedFiles(prev => [...prev, ...validFiles]);
        setUploadErros([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.numberOfPieces <= 0) {
            setValidationErrors(prev => ({ ...prev, numberOfPieces: "Este campo es obligatorio" }));
            return;
        }

        if (formData.operatorPayroll <= 0) {
            setValidationErrors(prev => ({ ...prev, operatorPayroll: "Este campo es obligatorio" }));
            return;
        }

        if (
            !formData.insepector ||
            !formData.partNumber ||
            formData.idDefect === null ||
            formData.idCondition === null ||
            formData.idLine === null ||
            formData.idClient === null ||
            formData.idContainmentaction === null
        ) {
            setError("Por favor completa todos los campos obligatorios.");
            return;
        }

        if (selectedFiles.length > 4) {
            setError("No puedes subir más de 4 imágenes.");
            return;
        }

        Swal.fire({
            title: isEditing ? "Acutualizando..." : "Guardando",
            html: "Por favor espere",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        setIsSubmitting(true);

        try {
            if (isEditing && rejectionId) {
                await rejectionService.updateRejection(rejectionId, formData, selectedFiles);
                Swal.fire({
                    title: "¡Actualido!",
                    text: "El rechazo ha sido actualizado",
                    icon: "success"
                });
            } else {
                setError(null);
                setUploading(true);

                Swal.fire({
                    title: 'Enviando registro...',
                    text: 'Por favor, espere mientras se procesa su solicitud.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    customClass: {
                        popup: 'bg-white rounded-lg shadow-xl',
                        title: 'text-xl font-bold text-gray-800',
                        htmlContainer: 'text-gray-600 text-center',
                    },
                });

                const response = await rejectionService.createRejection(formData, selectedFiles);

                await Swal.close();

                if (response.success) {
                    setSelectedFiles([]);
                    setFormData({
                        insepector: "",
                        partNumber: "",
                        numberOfPieces: 0,
                        description: "",
                        image: "",
                        informedSignature: "",
                        operatorPayroll: 0,
                        registrationDate: new Date().toISOString().split("T")[0],
                        folio: 0,
                        idDefect: 0,
                        idCondition: 0,
                        idLine: 0,
                        idClient: 0,
                        idContainmentaction: 0
                    });

                    setValidationErrors({
                        numberOfPieces: "",
                        operatorPayroll: "",
                    });


                    Swal.fire({
                        title: "Guardado exitosamente",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false
                    });

                } else {
                    Swal.fire({
                        title: "Error al registrar",
                        text: response.message || "No se pudo guardar el rechazo. Intente nuevamente.",
                        icon: "error"
                    });
                }
            }
            onSuccess?.();
        } catch (error: any) {
            Swal.close();

            Swal.fire({
                title: "Error inesperado",
                text: error instanceof Error ? error.message : "Ocurrió un error inesperado. Intente nuevamente.",
                icon: "error"
            });

            console.error("Error al crear el registro: ", error);

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Ocurrio un error inesperado. Intente nuevamente");
            }
        } finally {
            setUploading(false);
            setIsSubmitting(false);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingFile = (index: number) => {
        // Aquí deberás decidir cómo manejar la eliminación en el backend.
        // Por ahora, solo la quitamos de la vista.
        setExistingImageUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSignatureChange = (signatureBase64: string) => {
        setFormData(prev => ({ ...prev, informedSignature: signatureBase64 }));
    };

    const defectOptions = defects.map((defects) => ({
        value: defects.id.toString(),
        label: defects.name
    }));

    const conditionOptions = conditions.map((condition) => ({
        value: condition.id.toString(),
        label: condition.name,
    }));

    const lineOptions = lines.map((line) => ({
        value: line.id.toString(),
        label: line.name
    }));

    const clientOptions = clients.map((client) => ({
        value: client.id.toString(),
        label: client.name
    }));

    const actionOptions = actions.map((action) => ({
        value: action.id.toString(),
        label: action.name
    }));

    return (
        <>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <FormInput
                    type="text"
                    name="registrationDate"
                    label="Fecha"
                    value={new Date(formData.registrationDate).toLocaleDateString('es-MX', {
                        year: 'numeric', month: '2-digit', day: '2-digit'
                    })}
                    readOnly
                    className="bg-gray-50 cursor-not-allowed"
                />

                <FormInput
                    label="Folio"
                    type="text"
                    name="folio"
                    value={isEditing ? formData.folio : nextFolio}
                    readOnly
                    className="bg-gray-50 cursor-not-allowed"
                />


                {
                    loadingFolio && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
                            Cargando folio consecutivo...
                        </div>
                    )
                }

                <FormInput
                    type="text"
                    label="Inspector"
                    name="insepector"
                    defaultValue={formData.insepector}
                    onChange={handleInputChange}
                />

                <FormInput
                    type="text"
                    label="Número de parte"
                    name="partNumber"
                    defaultValue={formData.partNumber}
                    onChange={handleInputChange}
                />

                <div className="space-y-1">
                    <label htmlFor="numberOfPieces" className="block text-sm font-medium text-gray-700">
                        Cantidad de piezas
                    </label>
                    <input
                        type="number"
                        name="numberOfPieces"
                        value={formData.numberOfPieces}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md ${validationErrors.numberOfPieces
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                        min="0"
                        step="1"
                    />
                    {validationErrors.numberOfPieces && (
                        <p className="text-sm text-red-500 mt-1">{validationErrors.numberOfPieces}</p>
                    )}
                </div>

                <FormInput
                    type="select"
                    label="Defecto"
                    name="idDefect"
                    options={defectOptions}
                    value={formData.idDefect}
                    onChange={handleInputChange}
                    required
                />

                {loadingConditions && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
                        Cargando condiciones...
                    </div>
                )}

                <FormInput
                    type="select"
                    label="Condición"
                    name="idCondition"
                    options={conditionOptions}
                    value={formData.idCondition}
                    onChange={handleInputChange}
                    required
                />

                <FormInput
                    type="select"
                    label="Linea"
                    name="idLine"
                    options={lineOptions}
                    value={formData.idLine}
                    onChange={handleInputChange}
                    required
                />

                <FormInput
                    type="select"
                    label="Cliente"
                    name="idClient"
                    options={clientOptions}
                    value={formData.idClient}
                    onChange={handleInputChange}
                    required
                />

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Nómina operador
                    </label>
                    <input
                        type="number"
                        name="operatorPayroll"
                        value={formData.operatorPayroll}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md ${validationErrors.operatorPayroll
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                        min="0"
                        step="1"
                    />
                    {validationErrors.operatorPayroll && (
                        <p className="text-sm text-red-500 mt-1">{validationErrors.operatorPayroll}</p>
                    )}
                </div>

                <FormInput
                    type="select"
                    label="Acción de contención"
                    name="idContainmentaction"
                    options={actionOptions}
                    value={formData.idContainmentaction}
                    onChange={handleInputChange}
                    required
                />

                <div className="mt-6">
                    <label
                        htmlFor="file-input"
                        className="flex flex-col items-center rounded border border-gray-300 p-4 
                                    text-gray-900 shadow-sm sm:p-6 cursor-pointer hover:border-gray-400 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                            />
                        </svg>

                        <span className="mt-4 font-medium">Sube tus imágenes</span>

                        <span
                            className="mt-2 inline-block rounded border border-gray-200 
                                        bg-gray-50 px-3 py-1.5 text-center text-xs font-medium 
                                        text-gray-700 shadow-sm hover:bg-gray-100"
                        >
                            Examinar archivos
                        </span>

                        <input
                            id="file-input"
                            type="file"
                            className="sr-only"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                    </label>

                    {uploadErrors.length > 0 && (
                        <div className="mt-2 text-sm text-red-600 space-y-1">
                            {uploadErrors.map((err, i) => (
                                <div key={i} className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    {err}
                                </div>
                            ))}
                        </div>
                    )}

                    {existingImageUrls.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <h4 className="text-sm font-medium text-gray-700">
                                Imágenes actuales:
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {existingImageUrls.map((url, index) => (
                                    <div key={index} className="relative group rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
                                        <img src={url} alt={`Imagen existente ${index + 1}`} className="h-20 w-20 object-cover rounded" />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingFile(index)}
                                            className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs shadow-md hover:bg-red-600"
                                            aria-label="Eliminar imagen"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <h4 className="text-sm font-medium text-gray-700">
                                Imágenes seleccionadas ({selectedFiles.length}/4):
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {selectedFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="relative group rounded-lg border border-gray-200 bg-white p-2 shadow-sm"
                                    >
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            className="h-20 w-20 object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="absolute -top-1 -right-1 h-6 w-6 rounded-full 
                                                        bg-red-500 text-white flex items-center justify-center 
                                                        text-xs shadow-md hover:bg-red-600 hover:cursor-pointer"
                                            aria-label="Eliminar imagen"
                                        >
                                            ×
                                        </button>
                                        <p className="text-xs text-gray-600 mt-1 truncate max-w-20">
                                            {file.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {uploading && (
                        <div className="mt-3 flex items-center text-sm text-blue-700">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Subiendo imágenes...
                        </div>
                    )}
                </div>

                <FormInput
                    type="textarea"
                    label="Descripción"
                    name="description"
                    rows={4}
                    defaultValue={formData.description}
                    onChange={handleInputChange}
                />

                {isEditing && formData.informedSignature ? (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Firma guardada
                        </label>
                        <div className="border rounded-md p-2 bg-gray-50">
                            <img
                                src={formData.informedSignature}
                                alt="Firma guardada"
                                className="mx-auto"
                                crossOrigin="anonymous"
                            />
                        </div>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => setFormData(prev => ({ ...prev, informedSignature: "" }))}
                        >
                            Cambiar Firma
                        </Button>
                    </div>
                ) : (
                    <SignaturePad
                        label="Firma"
                        onSignatureChange={handleSignatureChange}
                        initialData={""}
                    />
                )}

                <Button type="submit" variant="secondary" size="sm">
                    {isEditing ? "Guardar" : "Guardando..."}
                </Button>
            </form>
        </>
    )
}