import type React from "react";

type InputType =
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "tel"
    | "url"
    | "search"
    | "select"
    | "textarea";

interface Props {
    label: string;
    name: string;
    type?: InputType;
    placeholder?: string;
    required?: boolean;
    readOnly?: boolean;
    options?: { value: string; label: string }[];
    className?: string;
    labelClassName?: string;
    rows?: number;
    defaultValue?: string | number;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}
export const FormInput: React.FC<Props> = ({
    label,
    name,
    type = "text",
    placeholder,
    required = false,
    readOnly = false,
    options = [],
    className: inputClassName,
    labelClassName: labelClassNameProp,
    rows = 3,
    defaultValue,
    value,
    onChange,
}) => {

    const defaultLabelClass = "block text-sm font-medium text-gray-700 mb-1";
    const defaultInputClass =
        "block w-full border border-gray-300 rounded-md shadow-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";

    const labelClass = `${defaultLabelClass} ${labelClassNameProp || ""}`;
    const inputClass = `${defaultInputClass} ${inputClassName || ""}`;

    const isControlled = value !== undefined;

    return (
        <>
            <div className="mb-4">
                <label htmlFor={name} className={labelClass}>
                    {label} {required && <span className="text-red-500">*</span>}
                </label>

                {
                    type === "select" ? (
                        <select
                            id={name}
                            name={name}
                            className={inputClass}
                            required={required}
                            value={isControlled ? value : defaultValue}
                            onChange={onChange}
                        >
                            <option value="">Selecciona una opción...</option>
                            {
                                options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))
                            }
                        </select>
                    ) : type === "textarea" ? (
                        <textarea
                            id={name}
                            name={name}
                            className={inputClass}
                            placeholder={placeholder}
                            required={required}
                            rows={rows}
                            value={isControlled ? value : defaultValue}
                            onChange={onChange}
                        />
                    ) : (
                        <input
                            type={type}
                            id={name}
                            name={name}
                            className={inputClass}
                            placeholder={placeholder}
                            required={required}
                            value={isControlled ? value : defaultValue}
                            onChange={onChange}
                            readOnly={readOnly}
                        />
                    )
                }
            </div>
        </>
    )
}
