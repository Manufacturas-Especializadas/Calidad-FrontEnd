import { useEffect, useState } from "react";
import Logo from "../../assets/logomesa.png";
import { Button } from "../../components/Button/Button";
import type { Roles } from "../../interfaces/Roles";
import { rejectionService } from "../../api/services/RejectionService";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

interface RegisterForm {
    name: string;
    payRollNumber: number;
    password: string;
    roleName: string;
}

export const Register = () => {
    const [formData, setFormData] = useState<RegisterForm>({
        name: "",
        payRollNumber: 0,
        password: "",
        roleName: "",
    });

    const [roles, setRoles] = useState<Roles[]>([]);
    const [error, setError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadRoles = async () => {
            try {
                const data = await rejectionService.getRoles();
                setRoles(data);
            } catch (error: any) {
                console.error("Error al cargar roles", error);
            }
        };
        loadRoles();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "payRollNumber" ? (value === "" ? 0 : Number(value)) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        if (!formData.name.trim() || formData.payRollNumber <= 0 || !formData.password || !formData.roleName) {
            setError("Por favor, completa todos los campos correctamente.");
            setIsSubmitting(false);
            return;
        }

        try {
            await rejectionService.register(
                formData.name,
                formData.payRollNumber,
                formData.password,
                formData.roleName
            );

            Swal.fire({
                title: "¡Éxito!",
                text: "Usuario registrado exitosamente.",
                icon: "success",
                confirmButtonText: "Aceptar"
            });

            navigate("/");
        } catch (err: any) {
            console.error("Error en registro:", err);
            const errorMessage = err?.response?.data?.message || err.message || "Error al registrar usuario. Inténtalo de nuevo.";
            setError(errorMessage);

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

    const rolesOptions = roles.map(role => ({
        value: role.name,
        label: role.name
    }));

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                    <div className="flex justify-center mb-8">
                        <img src={Logo} alt="MESA" className="h-20 w-auto" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 uppercase">
                        Registrar usuario
                    </h2>

                    {error && <div className="text-red-500 text-center mb-4">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Número de nómina
                            </label>
                            <input
                                type="number"
                                name="payRollNumber"
                                value={formData.payRollNumber || ""}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                min="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Rol</label>
                            <select
                                name="roleName"
                                value={formData.roleName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Selecciona un rol</option>
                                {rolesOptions.map(role => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-center gap-2">
                            <Button
                                type="submit"
                                variant="secondary"
                                size="sm"
                                disabled={isSubmitting}
                            >
                                REGISTRAR
                            </Button>
                            <Button
                                type="button"
                                variant="cancel"
                                size="sm"
                                onClick={() => navigate("/")}
                                disabled={isSubmitting}
                            >
                                CANCELAR
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};