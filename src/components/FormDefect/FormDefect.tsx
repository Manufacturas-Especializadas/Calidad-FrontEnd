import React, { useEffect, useState } from "react";
import { FormInput } from "../FormInput/FormInput";
import { Button } from "../Button/Button";
import { defectsService, type DefectFormData } from "../../api/services/DefectsService";
import Swal from "sweetalert2";

interface Props {
    onSuccess?: () => void;
    defectId?: number;
};

export const FormDefect = ({ onSuccess, defectId }: Props) => {
    const [formData, setFormData] = useState<DefectFormData>({
        name: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (defectId) {
            setIsEditing(true);
            const loadDefect = async () => {
                try {
                    const defect = await defectsService.getDefectById(defectId);
                    setFormData({ name: defect.name });
                } catch (error: any) {
                    Swal.fire({
                        title: "Error",
                        text: "No se pudo cargar el defecto",
                        icon: "error"
                    });
                }
            };
            loadDefect();
        } else {
            setIsEditing(false);
            setFormData({ name: "" });
        };
    }, [defectId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            Swal.fire({
                title: "Datos invalidos",
                text: "El nombre no puede estar vacio",
                icon: "warning"
            });
            return;
        }

        Swal.fire({
            title: isEditing ? "Actualizando..." : "Guardando...",
            html: "Por favor espere",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        setIsSubmitting(true);

        try {
            if (isEditing && defectId) {
                await defectsService.updateDefect(defectId, formData);
                Swal.fire({
                    title: "¡Actualizado!",
                    text: "El defecto ha sido actualizado correctamente",
                    icon: "success"
                });
            } else {
                await defectsService.createDefect(formData);
                Swal.fire({
                    title: "¡Registrado!",
                    text: "El defecto ha sido creado correctamente",
                    icon: "success"
                });
            };

            setFormData({ name: "" });
            onSuccess?.();
        } catch (error: any) {
            Swal.close();
            Swal.fire({
                title: "Error",
                text: isEditing
                    ? "No se pudo actualizar el defecto"
                    : "No se pudo registrar el defecto",
                icon: "error"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <form className="space-y-5" onSubmit={handleSubmit}>
                <FormInput
                    type="text"
                    label="Nombre de la linea"
                    name="name"
                    onChange={handleInputChange}
                    value={formData.name}
                />

                <Button type="submit" size="sm" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando..." : isEditing ? "Actualizar" : "Registrar"}
                </Button>
            </form>
        </>
    )
}
