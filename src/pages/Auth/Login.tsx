import React, { useState } from "react";
import Logo from "../../assets/logomesa.png";
import { Button } from "../../components/Button/Button";
import { rejectionService } from "../../api/services/RejectionService";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import { FormInput } from "../../components/FormInput/FormInput";

interface LoginForm {
    payRollNumber: string;
    password: string;
}

export const Login = () => {
    const { login } = useAuth();

    const [formData, setFormData] = useState<LoginForm>({
        payRollNumber: "",
        password: ""
    });

    const [error, setError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        const payRollNumber = formData.payRollNumber.trim();
        if (!payRollNumber || isNaN(Number(payRollNumber)) || Number(payRollNumber) <= 0) {
            setError("Por favor, ingresa un número de nómina válido.");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await rejectionService.login(Number(payRollNumber), formData.password);

            if (!response || response.isSuccess === false) {
                Swal.fire({
                    title: "Credenciales incorrectas",
                    text: "El número de nómina o la contraseña son incorrectos.",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
                return;
            }

            // localStorage.setItem("token", response.accessToken);
            login(response.accessToken)
            localStorage.setItem("refreshToken", response.refreshToken);

            Swal.fire({
                title: "¡Bienvenido!",
                text: "Has iniciado sesión correctamente.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });

            setTimeout(() => {
                navigate("/");
            }, 1200);

        } catch (err: any) {
            console.error("Error en login:", err);
            const errorMessage = err?.response?.data?.message || err.message || "Error al iniciar sesión. Inténtalo de nuevo.";

            Swal.fire({
                title: "Error",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                    <div className="flex justify-center mb-8">
                        <img src={Logo} alt="MESA" className="h-20 w-auto" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 uppercase">
                        Iniciar sesión
                    </h2>

                    {error && <div className="text-red-500 text-center mb-4">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <FormInput
                                label="Número de nómina"
                                type="text"
                                name="payRollNumber"
                                value={formData.payRollNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <FormInput
                                label="Contraseña"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                variant="secondary"
                                size="sm"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                            </Button>
                        </div>
                        <p className="text-sm text-gray-700 text-center">
                            ¿No tienes acceso? Contacta al equipo de Innovación
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};