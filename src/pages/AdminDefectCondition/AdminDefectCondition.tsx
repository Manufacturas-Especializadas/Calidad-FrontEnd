// import { useState } from "react";
// import { Button } from "../../components/Button/Button";
// import { Table } from "../../components/Table/Table";

// export const AdminDefectCondition = () => {
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     return (
//         <>
//             <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//                 <div className="max-w-7xl mx-auto">
//                     <header className="mb-6 md:mb-8">
//                         <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
//                             Panel de administración
//                         </h1>
//                         <p className="mt-1 text-sm md:text-base text-gray-600">
//                             Gestiona las condicions de los defectos
//                         </p>
//                     </header>

//                     <div className="mb-4 flex justify-evenly">
//                         <Button variant="secondary" size="sm">
//                             REGRESAR
//                         </Button>
//                         <Button variant="secondary" size="sm">
//                             REGISTRAR NUEVA CONDICIÓN
//                         </Button>
//                     </div>

//                     <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                         <div className="p-4 md:p-6">
//                             {loading ? (
//                                 <div className="py-12 text-center">
//                                     Cargando datos...
//                                 </div>
//                             ) : error ? (
//                                 <div className="py-12 text-center">
//                                     <div className="text-red-500 font-medium mb-2">{error}</div>
//                                     <button className="bg-primary text-white px-4 py-2 rounded-md
//                                         hover:bg-secondary transition-all hover:cursor-pointer">
//                                         Reintentar
//                                     </button>
//                                 </div>
//                             ) : (
//                                 <></>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }
