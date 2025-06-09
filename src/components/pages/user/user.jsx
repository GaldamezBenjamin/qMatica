import React from 'react';
import Footer from "../../shared/Footer";


function User() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">

      <div className="container mx-auto p-6 flex-grow">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Perfil de Usuario</h1>
        <div className="bg-white rounded-lg shadow-md p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna 1: Información del Usuario */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start">
            <img

              alt="Avatar de Julio Diaz"
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
            <div className="text-center md:text-left">
              <div className="font-semibold text-gray-800 text-lg">Julio Diaz <span className="text-yellow-500">👑</span></div>
              <div className="text-sm text-gray-500">#974</div>
              <div className="text-xs text-gray-500 mt-1">Te uniste el 14/02/2025</div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">Correo:</div>
              <div className="text-sm text-gray-800">j****@***.com</div>
            </div>
            <div className="mt-2">
              <div className="text-sm text-gray-600">Contraseña:</div>
              <div className="text-sm text-gray-800">**********</div>
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4">
              Editar Datos
            </button>
          </div>

          {/* Columna 2: Estadísticas */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600">Total quizzes completados</div>
              <div className="text-2xl font-semibold text-gray-800 mt-1">193</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600">Total respuestas correctas</div>
              <div className="text-2xl font-semibold text-gray-800 mt-1">3.739</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600">Total respuestas incorrectas</div>
              <div className="text-2xl font-semibold text-gray-800 mt-1">121</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600">Tiempo promedio en completar quizzes</div>
              <div className="text-xl font-semibold text-gray-800 mt-1">15 m : 53 s</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 col-span-2">
              <div className="text-sm text-gray-600 mb-2">Categorías más débiles</div>
              <ol className="list-decimal pl-5 text-sm text-gray-800">
                <li>Funciones trigonométricas: 54 respuestas incorrectas</li>
                <li>Relaciones métricas: 28 respuestas incorrectas</li>
              </ol>
            </div>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full text-sm">
              Ver estadísticas completas
            </button>
          </div>

          {/* Columna 3: Rango y Suscripción */}
          <div className="md:col-span-1 flex flex-col">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="text-sm text-gray-600">Rango</div>
              <div className="text-2xl font-semibold text-yellow-500 mt-2">Oro</div>
              <div className="bg-gray-200 rounded-full h-3 mt-2 relative">
                <div className="bg-yellow-500 rounded-full h-3 absolute left-0" style={{ width: '50%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>40000</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">50%</div>
              <div className="mt-4 text-sm text-gray-600">Rango en anterior ciclo:</div>
              <div className="text-sm font-semibold text-gray-800">Oro (100% / 40000 EXP) <span className="text-yellow-500">👑</span></div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600">Fecha de suscripción:</div>
              <div className="text-sm font-semibold text-gray-800">16/02/2023</div>
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full mt-4 text-sm">
                Editar Suscripción
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default User;