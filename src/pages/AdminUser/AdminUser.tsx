import { useNavigate } from "react-router";
import { Button } from "../../components/Button/Button";
import { useEffect, useState } from "react";
import type { Users } from "../../interfaces/Users";
import { userService } from "../../api/services/UserService";
import { Table } from "../../components/Table/Table";
import Swal from "sweetalert2";

export const AdminUser = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState<Users[]>([]);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const navigate = useNavigate();

    const handlDelete = async (row: Users) => {
        const result = await Swal.fire({
            title: "¿Estas seguro?",
            text: `Vas eliminar el usuario de: ${row.name}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!result.isConfirmed) {
            return;
        }

        setActionLoading(row.id);

        try {
            const response = await userService.deleteUser(row.id);

            if (response.success) {
                setUsers(users.filter(user => user.id !== row.id));

                Swal.fire({
                    title: "¡Eliminado!",
                    text: "El usuario ha sido eliminado",
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: response.message || "No se pudo eliminar el usuario",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
            }
        } catch (error: any) {
            console.error("Error al eliminar: ", error);
            Swal.fire({
                title: "Error",
                text: "Hubo un problema al comunicarse con el servidor",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        } finally {
            setActionLoading(null);
        }
    };

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await userService.getUsers();
                setUsers(data);
                setError(null);
            } catch (error: any) {
                console.error("Error loading users", error);
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);


    const columns = [
        {
            name: "Nombre",
            selector: (row: Users) => row.name
        },
        {
            name: "Número de nómina",
            selector: (row: Users) => row.payRollNumber
        },
        {
            name: "Rol",
            selector: (row: Users) => row.roleName
        }
    ];
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Panel de usuarios
                    </h1>
                </header>

                <div className="mb-4 flex justify-between">
                    <Button variant="primary" size="sm" onClick={() => navigate("/administrador")}>
                        REGRESAR
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => navigate("/register")}>
                        REGISTRAR USUARIO
                    </Button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 md:p-6">
                        {loading ? (
                            <div className="py-12 text-center text-gray-500">
                                Cargando datos...
                            </div>
                        ) : error ? (
                            <div className="py-12 text-center">
                                <div className="text-red-500 font-medium mb-2">{error}</div>
                                <button className="bg-primary text-white px-4 py-2 rounded-md 
                                        hover:bg-secondary transition-all hover:cursor-pointer">
                                    Reintentar
                                </button>
                            </div>
                        ) : (
                            <Table<Users>
                                columns={columns}
                                data={users}
                                onDelete={handlDelete}
                                actionLoading={actionLoading}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}