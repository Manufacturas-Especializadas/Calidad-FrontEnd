import { useState } from "react";
import { useNavigate } from "react-router";
import { FaBars, FaSignOutAlt, FaTimes, FaUser } from "react-icons/fa";
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

    if (loading) {
        return null;
    }

    if (!user) {
        return null;
    }

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
        <>
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

                        {/* Menú de navegación */}
                        <div className="hidden md:flex items-center space-x-6">
                            {dataNavigation.map((nav) => (
                                <button
                                    key={nav.id}
                                    onClick={() => handleNavClick(nav.path)}
                                    className="text-white font-medium text-sm uppercase tracking-wider 
                                    hover:text-secondary transition-all duration-300 transform hover:scale-105 
                                    focus:outline-none focus:ring-2 focus:ring-secondary/50 rounded-md px-3 py-2 
                                    relative overflow-hidden group hover:cursor-pointer"
                                    aria-label={`Ir a ${nav.name}`}
                                >
                                    <span className="relative z-10">{nav.name}</span>
                                    <span className="absolute inset-0 bg-secondary opacity-0 
                                    group-hover:opacity-10 transition-opacity duration-300 rounded-md"></span>
                                </button>
                            ))}

                            {/* Botón de autenticación */}
                            {user ? (
                                <div className="flex items-center space-x-3">
                                    <span className="text-white font-medium hidden sm:inline">
                                        Hola, {user.name}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center text-white hover:text-red-300 transition-colors
                                        hover:cursor-pointer"
                                        aria-label="Cerrar sesión"
                                    >
                                        <FaSignOutAlt className="text-sm" />
                                        <span className="ml-1 hidden sm:inline">Salir</span>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => navigate("/login")}
                                    className="flex items-center text-white font-medium hover:text-secondary 
                                    transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/50
                                    hover:cursor-pointer"
                                    aria-label="Iniciar sesión"
                                >
                                    <FaUser className="mr-1" />
                                    <span>Iniciar sesión</span>
                                </button>
                            )}
                        </div>

                        {/* Botón del menú móvil */}
                        <div className="md:hidden flex items-center space-x-4">
                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="text-white p-2 rounded-full hover:bg-primary/30
                                    hover:cursor-pointer"
                                    aria-label="Cerrar sesión"
                                >
                                    <FaSignOutAlt />
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate("/login")}
                                    className="text-white p-2 rounded-full hover:bg-primary/30
                                    hover:cursor-pointer"
                                    aria-label="Iniciar sesión"
                                >
                                    <FaUser />
                                </button>
                            )}

                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-white p-2 rounded-lg bg-primary/20 hover:bg-primary/30 
                                transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary/50
                                hover:cursor-pointer"
                                aria-expanded={isOpen}
                                aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                            >
                                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menú móvil */}
                {isOpen && (
                    <div className="md:hidden bg-white shadow-xl border-t border-gray-100 animate-fadeIn">
                        <div className="px-2 pt-2 pb-3 space-y-1">
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

                            <div className="border-t border-gray-200 pt-3 px-3">
                                {user ? (
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center px-3 py-2 text-red-600 font-medium 
                                        hover:bg-red-50 rounded-lg transition-colors hover:cursor-pointer"
                                    >
                                        <FaSignOutAlt className="mr-2" />
                                        Cerrar sesión
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            navigate("/login");
                                            setIsOpen(false);
                                        }}
                                        className="w-full flex items-center justify-center px-3 py-2 text-primary font-medium 
                                        hover:bg-gray-100 rounded-lg transition-colors hover:cursor-pointer"
                                    >
                                        <FaUser className="mr-2" />
                                        Iniciar sesión
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </>
    )
}
