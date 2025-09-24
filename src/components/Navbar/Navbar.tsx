import { useState } from "react";
import { useNavigate } from "react-router";
import { FaBars, FaTimes } from "react-icons/fa";
import Logo from "../../assets/logomesa.png";
import { dataNavigation } from "../../data/dataNavigation";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleNavClick = (path: string) => {
        navigate(path);
        setIsOpen(false);
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

                        <div className="hidden md:flex items-center space-x-8">
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
                        </div>

                        <div className="md:hidden">
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

                {isOpen && (
                    <div className="md:hidden bg-white shadow-xl border-t border-gray-100 animate-fadeIn">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {dataNavigation.map((nav) => (
                                <button
                                    key={nav.id}
                                    onClick={() => handleNavClick(nav.path)}
                                    className="flex items-center w-full px-3 py-3 text-left text-gray-800 
                                    font-medium text-base uppercase tracking-wide hover:bg-gray-50 rounded-lg 
                                    transition-all duration-250 transform hover:translate-x-2 focus:outline-none 
                                    focus:ring-2 focus:ring-secondary/40 hover:cursor-pointer"
                                    aria-label={`Ir a ${nav.name}`}
                                >
                                    <span className="ml-2">{nav.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </>
    )
}
