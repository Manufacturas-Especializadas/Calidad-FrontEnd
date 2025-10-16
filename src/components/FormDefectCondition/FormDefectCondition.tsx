import { useEffect, useState } from "react";
import type { DefectConditionFormData } from "../../api/services/DefectCondiontionService";

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

    useEffect(() => {
        if (defectId) {
            setIsEditing(true);
        }
    })

    return (
        <>
            <form className="space-y-5">

            </form>
        </>
    )
}