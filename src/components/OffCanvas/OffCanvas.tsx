import type React from "react";

interface Props {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    width?: string;
    children: React.ReactNode;
}

export const OffCanvas: React.FC<Props> = ({ title, isOpen, onClose, width = "md:w-120", children }) => {
    return (
        <>
            <div
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                className={`fixed inset-0 z-50 transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                className={`fixed top-0 right-0 h-full bg-white shadow-xl z-51 transform transition-all duration-300 ease-in-out ${width
                    } ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="offcanvas-title"
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2
                        id="offcanvas-title"
                        className="text-lg font-semibold text-gray-800 uppercase tracking-wide"
                    >
                        {title}
                    </h2>
                    <button
                        className="text-gray-500 hover:text-gray-700 focus:outline-none 
                        focus:ring-2 focus:ring-blue-500 rounded-full p-1 transition-colors hover:cursor-pointer"
                        onClick={onClose}
                        aria-label="Cerrar panel"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="p-4 overflow-y-auto h-[calc(100%-80px)]">
                    {children}
                </div>
            </div>
        </>
    );
};