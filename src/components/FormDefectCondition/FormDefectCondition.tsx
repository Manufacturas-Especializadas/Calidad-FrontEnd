import { useEffect, useState } from "react";
import { defectConditionService, type DefectConditionFormData } from "../../api/services/DefectCondiontionService";
import Swal from "sweetalert2";
import type { Defects } from "../../interfaces/Defects";
import { FormInput } from "../FormInput/FormInput";
import { Button } from "../Button/Button";

interface Props {
    onSuccess?: () => void;
    defectId?: number;
}

export const FormDefectCondition = ({ onSuccess, defectId }: Props) => {
    const [formData, setFormData] = useState<DefectConditionFormData>({
        idDefects: 0,
        name: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [defects, setDefects] = useState<Defects[]>([]);

    useEffect(() => {
        if (defectId) {
            setIsEditing(true);

            const loadCondition = async () => {
                try {
                    const condition = await defectConditionService.getConditionById(defectId);

                    if (condition) {
                        setFormData({
                            name: condition.name,
                            idDefects: condition.idDefects
                        });
                    } else {
                        setFormData({ name: "", idDefects: defectId });
                    }
                } catch (error: any) {
                    Swal.fire({
                        title: "Error",
                        text: "No se pudo cargar la condición",
                        icon: "error"
                    });
                    setFormData({ name: "", idDefects: defectId });
                }
            };
            loadCondition();
        } else {
            setIsEditing(false);
            setFormData({ name: "", idDefects: 0 });
        }
    }, [defectId]);

    useEffect(() => {
        const loadDefects = async () => {
            try {
                const data = await defectConditionService.getDefects();
                setDefects(data);
            } catch (error: any) {
                console.error("Error loading defects: ", error);
            }
        };
        loadDefects();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.idDefects) {
            Swal.fire({
                title: "Datos inválidos",
                text: "Tienes que seleccionar un defecto",
                icon: "warning"
            });

            return;
        }

        Swal.fire({
            title: isEditing ? "Actualizanod..." : "Guardando...",
            html: "Por favor espere",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        setIsSubmitting(true);

        try {
            if (isEditing && defectId) {
                await defectConditionService.updateDefectCondition(defectId, formData);
                Swal.fire({
                    title: "¡Actualizado!",
                    text: "La condición ha sido acutalizada",
                    icon: "success"
                });
            } else {
                await defectConditionService.createDefectCondition(formData);
                Swal.fire({
                    title: "¡Registrado!",
                    text: "La condición ha sido creada correctament",
                    icon: "success"
                });
            }

            setFormData({ idDefects: 0, name: "" });
            onSuccess?.();
        } catch (error: any) {
            Swal.close();
            Swal.fire({
                title: "Error",
                text: isEditing
                    ? "No se pudo actualizar la condición"
                    : "No se pudo registrar la condición",
                icon: "error"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const defectOptions = defects.map((defect) => ({
        value: defect.id.toString(),
        label: defect.name
    }));

    return (
        <>
            <form className="space-y-5" onSubmit={handleSubmit}>
                <FormInput
                    type="select"
                    label="Selecciona un defecto"
                    name="idDefects"
                    options={defectOptions}
                    value={formData.idDefects}
                    onChange={handleInputChange}
                    required
                />

                <FormInput
                    type="text"
                    label="Nombre de la condición"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                />

                <Button type="submit" variant="secondary" size="sm">
                    {isSubmitting ? "Guardar" : "Guardando..."}
                </Button>
            </form>
        </>
    )
}