import React from 'react';
import Footer from "../../shared/Footer";
import main1 from "../../../assets/images/main1.png";

// Datos simulados para los temas del foro (adaptados para la imagen)
const foros = [
    {
        id: 213, // Ejemplo de ID numérico
        titulo: 'Aplicaciones del Teorema de Pitágoras en la Vida Real',
        descripcion: 'Comparte y discute ejemplos prácticos donde el Teorema de Pitágoras se usa en la vida cotidiana, la construcción o la navegación.',
        fechaCreacion: 'Creado el 01/04/2025',
        participantes: 14,
        estado: 'Activo',
    },
    {
        id: 1, // Otro ejemplo de ID numérico
        titulo: 'Volumen y Área en la Construcción y la Ingeniería',
        descripcion: 'Discusión sobre cómo se aplican los conceptos de volumen y área en proyectos de construcción, diseño y arquitectura.',
        fechaCreacion: 'Creado el 27/03/2025',
        participantes: 25,
        estado: 'Inactivo',
    },
    // ... puedes añadir más temas aquí
];

export default function Foro() {
    const handleSearch = () => {
        // Aquí puedes agregar la lógica para realizar la búsqueda
        console.log('Buscar foros...');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">

            <div
                className="w-full h-40 md:h-56 lg:h-64 bg-cover bg-center relative mb-6 flex items-center justify-center flex-col px-4"
                style={{ backgroundImage: `url(${main1})` }}
            >
                <h1 className="text-6xl font-bold text-white mb-2">Foros</h1> {/* Cambiamos a h1 y aumentamos el tamaño */}
                <div className="relative w-full md:w-1/3 lg:w-1/2">
                    <input
                        type="text"
                        placeholder="Buscar foros..."
                        className="w-full px-4 py-2 border border-white rounded shadow text-black bg-white focus:outline-none focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-transparent border-none outline-none cursor-pointer"
                    >
                    </button>
                </div>
            </div>

            <div className="container mx-auto py-8 px-4 md:px-8">

                {/* Sección de Resultados y Crear Foro */}
                <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-600">Mostrando {foros.length} de 12 resultados</p>
                    <button className="bg-[#f0596c] hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full flex items-center">
                        Crear Foro
                    </button>
                </div>

                {/* Lista de Temas del Foro */}
                <ul className="space-y-4">
                    {foros.map((foro) => (
                        <li key={foro.id} className="bg-white rounded-lg shadow-md p-4">
                            <div className="flex items-center">
                                <div className="relative mr-4">
                                    <span className="absolute bottom-0 right-0 bg-gray-200 text-gray-600 text-xs rounded-full px-1 py-0.5">
                                        #{foro.id}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <a href={`/foro/${foro.id}`} className="text-lg font-semibold text-black hover:underline">
                                        {foro.titulo}
                                    </a>
                                    <p className="text-gray-600 text-sm mt-1">{foro.descripcion}</p>
                                    <p className="text-gray-500 text-xs mt-2">{foro.fechaCreacion}</p>
                                </div>
                                <div className="ml-4 text-right flex items-center">
                                    <div className="mr-2">
                                        <p className="text-sm text-gray-700">
                                            {foro.participantes} Participantes
                                        </p>
                                        <p className={`text-xs font-semibold ${foro.estado === 'Activo' ? 'text-green-500' : 'text-red-500'}`}>
                                            {foro.estado}
                                        </p>
                                    </div>
                                    <button className="bg-red-200 text-red-700 rounded-full w-8 h-8 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <Footer />
        </div>
    );
}