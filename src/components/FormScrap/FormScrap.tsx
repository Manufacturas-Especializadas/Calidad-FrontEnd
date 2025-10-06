import React, { useEffect, useState } from "react";
import { FormInput } from "../FormInput/FormInput";
import { scrapService, type ScrapFormData } from "../../api/services/ScrapService";
import type { Shift } from "../../interfaces/Shift";
import type { Lines } from "../../interfaces/Lines";
import type { Process } from "../../interfaces/Process";
import type { Machines } from "../../interfaces/Machines";
import type { Material } from "../../interfaces/Material";
import type { TypeScrap } from "../../interfaces/TypeScrap";
import type { ScDefects } from "../../interfaces/ScDefects";
import Swal from "sweetalert2";
import { Button } from "../Button/Button";

interface Props {
    onSuccess?: () => void;
};

export const FormScrap = ({ onSuccess }: Props) => {
    const [formData, setFormData] = useState<ScrapFormData>({
        shiftId: 0,
        lineId: 0,
        processId: 0,
        payRollNumber: "",
        materialId: 0,
        alloy: "",
        diameter: "",
        wall: "",
        typeScrapId: 0,
        defectId: 0,
        machineId: 0,
        rdm: "",
        weight: ""
    });
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [lines, setLines] = useState<Lines[]>([]);
    const [process, setProcess] = useState<Process[]>([]);
    const [machines, setMachines] = useState<Machines[]>([]);
    const [material, setMaterial] = useState<Material[]>([]);
    const [typeScrap, setTypeScrap] = useState<TypeScrap[]>([]);
    const [defects, setDefects] = useState<ScDefects[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadShifts = async () => {
            try {
                const data = await scrapService.getShifts();
                setShifts(data);
            } catch (error: any) {
                console.error("Error al obtener la lista", error);
            }
        }
        loadShifts();
    }, []);

    useEffect(() => {
        const loadMaterial = async () => {
            try {
                const data = await scrapService.getMaterial();
                setMaterial(data);
            } catch (error: any) {
                console.error("Error al obtener la lista", error);
            }
        }
        loadMaterial();
    }, []);

    useEffect(() => {
        const loadTypeScrap = async () => {
            try {
                const data = await scrapService.getTypeScrap();
                setTypeScrap(data);
            } catch (error: any) {
                console.error("Error al obtener la lista", error);
            }
        }
        loadTypeScrap();
    }, []);

    useEffect(() => {
        const loadLines = async () => {
            try {
                const data = await scrapService.getLines();
                setLines(data);
            } catch (error: any) {
                console.error("Error al obtener la lista", error);
            }
        }
        loadLines();
    }, []);

    useEffect(() => {
        const loadDefects = async () => {
            if (formData.typeScrapId > 0) {
                try {
                    const data = await scrapService.getDefectsByTypeScrap(formData.typeScrapId);
                    setDefects(data);
                } catch (error: any) {
                    console.error("Error al obtener los defectos", error);
                    setDefects([]);
                }
            } else {
                setDefects([]);
            }
        }
        loadDefects();
    }, [formData.typeScrapId]);

    useEffect(() => {
        const loadProcess = async () => {
            if (formData.lineId > 0) {
                try {
                    const data = await scrapService.getProcessByLine(formData.lineId);
                    setProcess(data);
                } catch (error: any) {
                    console.error("Error al obtener procesos", error);
                    setProcess([]);
                }
            } else {
                setProcess([]);
            }
        };

        loadProcess();
    }, [formData.lineId]);

    useEffect(() => {
        const loadMachines = async () => {
            if (formData.processId > 0) {
                try {
                    const data = await scrapService.getMachineCodeByProcess(formData.processId);
                    setMachines(data);
                } catch (error: any) {
                    console.error("Error al obtener los codigos de las maquinas", error);
                    setMachines([]);
                }
            } else {
                setMachines([]);
            }
        };
        loadMachines();
    }, [formData.processId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { payRollNumber, ...rest } = formData;

        if (!payRollNumber.trim()) {
            Swal.fire({
                title: "El número de nómina es requerido",
                icon: "warning"
            });
            return;
        }

        if (!/^\d+$/.test(payRollNumber.trim())) {
            Swal.fire({
                title: "El número de nómina debe contener solo dígitos",
                icon: "warning"
            });
            return;
        }

        const selectedDefect = defects.find(d => d.id === formData.defectId);
        const requiresRdm = selectedDefect?.name === "RDM interno" || selectedDefect?.name === "RDM externo";


        if (requiresRdm && !formData.rdm.trim()) {
            Swal.fire({
                title: "El campo RDM es requerido para este tipo de defecto",
                icon: "warning"
            });
        }

        const cleanPayRoll = payRollNumber.trim();
        const payload: ScrapFormData = {
            ...rest,
            payRollNumber: cleanPayRoll
        };

        Swal.fire({
            title: "Guardando registro...",
            html: "Por favor espera",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        setIsSubmitting(true);

        try {
            await scrapService.createScrap(payload);
            Swal.close();
            Swal.fire({
                title: "Registro creado",
                icon: "success"
            });

            setFormData({
                shiftId: 0,
                lineId: 0,
                processId: 0,
                payRollNumber: "",
                materialId: 0,
                alloy: "",
                diameter: "",
                wall: "",
                typeScrapId: 0,
                defectId: 0,
                machineId: 0,
                rdm: "",
                weight: ""
            });

            onSuccess?.();

        } catch (error: any) {
            Swal.close();
            console.error("Error al crear scrap", error);
            Swal.fire({
                title: "Hubo un error al guardar el registro",
                icon: "error"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const shiftOptions = shifts.map((shift) => ({
        value: shift.id.toString(),
        label: shift.name
    }));

    const lineOptions = lines.map((line) => ({
        value: line.id.toString(),
        label: line.name
    }));

    const processOptions = process.map((process) => ({
        value: process.id.toString(),
        label: process.name
    }));

    const machinesOptions = machines.map((machine) => ({
        value: machine.id.toString(),
        label: machine.name
    }));

    const materialOptions = material.map((material) => ({
        value: material.id.toString(),
        label: material.name
    }));

    const typeScrapOptions = typeScrap.map((scrap) => ({
        value: scrap.id.toString(),
        label: scrap.name
    }));

    const defectsOptions = defects.map((defect) => ({
        value: defect.id.toString(),
        label: defect.name
    }));

    return (
        <>
            <form className="space-y-5" onSubmit={handleSubmit}>

                <FormInput
                    type="select"
                    label="Turno"
                    name="shiftId"
                    value={formData.shiftId.toString()}
                    options={shiftOptions}
                    onChange={handleInputChange}
                />

                <FormInput
                    type="select"
                    label="Linea"
                    name="lineId"
                    value={formData.lineId.toString()}
                    options={lineOptions}
                    onChange={handleInputChange}
                />

                <FormInput
                    type="select"
                    label="Proceso"
                    name="processId"
                    value={formData.processId.toString()}
                    options={processOptions}
                    onChange={handleInputChange}
                />

                <FormInput
                    type="select"
                    label="Código de máquina"
                    name="machineId"
                    value={formData.machineId.toString()}
                    options={machinesOptions}
                    onChange={handleInputChange}
                />

                <FormInput
                    type="text"
                    label="Número de nómina"
                    name="payRollNumber"
                    value={formData.payRollNumber}
                    onChange={handleInputChange}
                />

                <FormInput
                    type="select"
                    label="Material"
                    name="materialId"
                    value={formData.materialId.toString()}
                    options={materialOptions}
                    onChange={handleInputChange}
                />

                <FormInput
                    type="text"
                    label="Aleación (opcional)"
                    name="alloy"
                    value={formData.alloy}
                    onChange={handleInputChange}
                />

                <FormInput
                    type="text"
                    label="Diametro (opcional)"
                    name="diameter"
                    value={formData.diameter}
                    onChange={handleInputChange}
                />

                <FormInput
                    type="text"
                    label="Pared (opcional)"
                    name="wall"
                    value={formData.wall}
                    onChange={handleInputChange}
                />

                <FormInput
                    type="select"
                    label="Tipo de scrap"
                    name="typeScrapId"
                    value={formData.typeScrapId.toString()}
                    options={typeScrapOptions}
                    onChange={handleInputChange}
                />

                <FormInput
                    type="select"
                    label="Defecto"
                    name="defectId"
                    value={formData.defectId.toString()}
                    options={defectsOptions}
                    onChange={handleInputChange}
                />

                <FormInput
                    type="text"
                    label="Peso(kg)"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                />

                <FormInput
                    type="text"
                    label="RDM"
                    name="rdm"
                    value={formData.rdm}
                    onChange={handleInputChange}
                />

                <Button type="submit" size="sm" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando..." : "Registrar"}
                </Button>
            </form>
        </>
    )
}