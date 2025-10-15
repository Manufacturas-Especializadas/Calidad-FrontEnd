import React, { useEffect, useState } from "react";
import { linesService, type LineFormData } from "../../api/services/LinesService";
import { FormInput } from "../FormInput/FormInput";
import { Button } from "../Button/Button";
import Swal from "sweetalert2";

interface Props {
    onSuccess?: () => void;
    lineId?: number;
};

export const FormLine = ({ onSuccess, lineId }: Props) => {
    const [formData, setFormData] = useState<LineFormData>({
        name: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (lineId) {
            setIsEditing(true);
            const loadLine = async () => {
                try {
                    const line = await linesService.getLineById(lineId);
                    setFormData({ name: line.name });
                } catch (error: any) {
                    Swal.fire({
                        title: "Error",
                        text: "No se pudo cargar la línea",
                        icon: "error"
                    });
                }
            };
            loadLine();
        } else {
            setIsEditing(false);
            setFormData({ name: "" });
        }
    }, [lineId]);


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
                title: "Datos inválidos",
                text: "El nombre no puede estar vacío",
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
            if (isEditing && lineId) {
                await linesService.updateLine(lineId, formData);
                Swal.fire({
                    title: "¡Actualizado!",
                    text: "La línea ha sido actualizada correctamente",
                    icon: "success"
                });
            } else {
                await linesService.createLine(formData);
                Swal.fire({
                    title: "¡Registrado!",
                    text: "La línea ha sido creada correctamente",
                    icon: "success"
                });
            }

            setFormData({ name: "" });
            onSuccess?.();
        } catch (error: any) {
            Swal.close();
            Swal.fire({
                title: "Error",
                text: isEditing
                    ? "No se pudo actualizar la línea"
                    : "No se pudo registrar la línea",
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
