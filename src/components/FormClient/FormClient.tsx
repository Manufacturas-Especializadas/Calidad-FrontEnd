import React, { useEffect, useState } from "react";
import { FormInput } from "../FormInput/FormInput";
import { Button } from "../Button/Button";
import Swal from "sweetalert2";
import { clientService, type ClientFormData } from "../../api/services/ClientsService";

interface Props {
    onSuccess?: () => void;
    clientId?: number;
};

export const FormClient = ({ onSuccess, clientId }: Props) => {
    const [formData, setFormData] = useState<ClientFormData>({
        name: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (clientId) {
            setIsEditing(true);
            const loadClient = async () => {
                try {
                    const client = await clientService.getClientById(clientId);
                    setFormData({ name: client.name });
                } catch (error: any) {
                    Swal.fire({
                        title: "Error",
                        text: "No se pudo cargar la línea",
                        icon: "error"
                    });
                }
            };
            loadClient();
        } else {
            setIsEditing(false);
            setFormData({ name: "" });
        }
    }, [clientId]);

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
            if (isEditing && clientId) {
                await clientService.updateClient(clientId, formData);
                Swal.fire({
                    title: "¡Actualizado!",
                    text: "El cliente ha sido actualizado correctamente",
                    icon: "success"
                });
            } else {
                await clientService.createClient(formData);
                Swal.fire({
                    title: "¡Registrado!",
                    text: "El cliente ha sido creado correctamente",
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
                    ? "No se pudo actualizar el cliente"
                    : "No se pudo registrar el cliente",
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
