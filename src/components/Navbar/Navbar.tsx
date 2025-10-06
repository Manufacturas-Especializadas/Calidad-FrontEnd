import { useState } from "react";
import { useNavigate } from "react-router";
import { FaBars, FaSignOutAlt, FaTimes } from "react-icons/fa";
import Logo from "../../assets/logomesa.png";
import { dataNavigation } from "../../data/dataNavigation";
import { useAuth } from "../../context/AuthContext";

export const Navbar = () => {
    const { user, loading, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleNavClick = (path: string) => {
        navigate(path);
        setIsOpen(false);
    };

    if (loading || !user) return null;

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                await fetch("/api/Auth/Logout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                });
            }
        } catch (error: any) {
            console.error("Error al cerrar sesión", error);
        } finally {
            logout();
            navigate("/login");
        }
    };

    return (
        <nav className="bg-primary shadow-lg shadow-primary/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <img
                            src={Logo}
                            alt="Logo de la empresa"
                            className="h-10 w-auto rounded-md shadow-sm border border-primary/20"
                            loading="lazy"
                        />
                        <h1 className="text-white text-xl font-bold tracking-tight">
                            CALIDAD
                        </h1>
                    </div>

                    <div className="flex items-center space-x-3">
                        <span className="text-white font-medium hidden sm:inline">
                            Hola, {user.name}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center text-white hover:text-red-300 transition-colors hover:cursor-pointer"
                            aria-label="Cerrar sesión"
                        >
                            <FaSignOutAlt className="text-sm" />
                            <span className="ml-1 hidden sm:inline">Salir</span>
                        </button>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white p-2 rounded-lg bg-primary/20 hover:bg-primary/30 
                            transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary/50
                            hover:cursor-pointer"
                            aria-expanded={isOpen}
                            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                        >
                            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={`bg-white shadow-xl border-t border-gray-100 overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="px-4 py-4 space-y-2">
                    {dataNavigation.map((nav) => (
                        <button
                            key={nav.id}
                            onClick={() => handleNavClick(nav.path)}
                            className="flex items-center w-full px-3 py-3 text-left text-gray-800 
                            font-medium text-base uppercase tracking-wide hover:bg-gray-50 rounded-lg 
                            transition-all duration-250 transform hover:translate-x-2 hover:cursor-pointer"
                            aria-label={`Ir a ${nav.name}`}
                        >
                            <span className="ml-2">{nav.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};