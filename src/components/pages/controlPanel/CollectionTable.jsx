// qmatica-frontend/src/components/CollectionTable.jsx
import React from 'react';

const CollectionTable = ({ documents, columns, onEdit, onDelete, documentType }) => {
  if (!documents || documents.length === 0) {
    return <p>No hay documentos en esta colección.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {documents.map(doc => (
            <tr key={doc.id || doc.id_quiz || doc.id_categoria || doc.id_super_cat}> {/* Usa una clave robusta */}
              {columns.map(col => (
                <td key={`${doc.id || doc.id_quiz || doc.id_categoria || doc.id_super_cat}-${col.key}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {/* Manejo especial para arrays o objetos si es necesario */}
                  {Array.isArray(doc[col.key]) ? doc[col.key].join(', ') : doc[col.key] && typeof doc[col.key] === 'object' ? JSON.stringify(doc[col.key]) : doc[col.key]}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(doc)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(doc.id || doc.id_quiz || doc.id_categoria || doc.id_super_cat)}
                  className="text-red-600 hover:text-red-900"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CollectionTable;