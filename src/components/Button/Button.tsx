import type React from "react";
import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface Props extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "cancel";
    size?: "sm" | "md" | "lg";
    uppercase?: boolean;
    fullWidth?: boolean;
    type?: "button" | "submit" | "reset";
}

export const Button: React.FC<Props> = ({
    children,
    variant = "primary",
    size = "md",
    uppercase = true,
    fullWidth = false,
    type = "button",
    className = "",
    disabled = false,
    ...reset
}) => {
    const baseClasses =
        "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantClasses = {
        primary: "bg-primary text-white hover:bg-secondary hover:shadow-xl",
        secondary: "bg-secondary text-white hover:bg-primary hover:shadow-xl",
        outline: "border border-primary text-primary hover:bg-secondary hover:text-white",
        cancel: "bg-cancel text-white hover:shadow-xl"
    };

    const sizeClasses = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    };

    const uppercaseClass = uppercase ? "uppercase" : "";
    const fullWidthClass = fullWidth ? "w-full" : "";

    const classes = [
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        uppercaseClass,
        fullWidthClass,
        disabled ? "opacity-50 cursor-not-allwed" : "hover:cursor-pointer",
        className
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <>
            <button type={type} className={classes} disabled={disabled} {...reset}>
                {children}
            </button>
        </>
    )
}
