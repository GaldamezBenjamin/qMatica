import React, { useState } from 'react';
import { SquarePen, Trash2, TriangleAlert, X } from 'lucide-react';

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const DynamicTable = ({ model, data, onEdit, onDelete, uniqueKeyField = 'id', itemsPerPage = 15 }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  if (!model || !model.campos) {
    return <div className="text-error">Error: Modelo inválido proporcionado a DynamicTable.</div>;
  }

  const tableData = data || [];

  const getColumnsToShow = () => {
    const columns = [];

    model.campos.forEach(campo => {
      if (campo.type === 'object' && campo.fields) {
        campo.fields.forEach(subCampo => {
          columns.push({
            key: `${campo.name}.${subCampo.name}`,
            label: `${subCampo.label || capitalize(subCampo.name)}`,
            type: subCampo.type,
            originalField: campo.name,
            subField: subCampo.name
          });
        });
      } else if (campo.name !== 'uid') {
        columns.push({
          key: campo.name,
          label: campo.label || capitalize(campo.name),
          type: campo.type
        });
      }
    });

    const uniqueColumns = [];
    const seenKeys = new Set();
    columns.forEach(col => {
      if (!seenKeys.has(col.key)) {
        uniqueColumns.push(col);
        seenKeys.add(col.key);
      }
    });

    return uniqueColumns;
  };

  const columnsToShow = getColumnsToShow();
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = tableData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete && onDelete) {
      onDelete(itemToDelete[uniqueKeyField]);
    }

    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const formatDisplayValue = (value, type) => {
    if (type === 'array') {
      if (!Array.isArray(value)) return '-';
      return `${value.length} Ítem${value.length !== 1 ? 's' : ''}`;
    }
    if (type === 'boolean') return value ? 'Sí' : 'No';
    if (type === 'timestamp' && value) {
      if (typeof value === 'object' && value._seconds !== undefined && value._nanoseconds !== undefined) {
        return new Date(value._seconds * 1000 + value._nanoseconds / 1000000).toLocaleDateString();
      } else if (typeof value === 'string') {
        try {
          return new Date(value).toLocaleDateString();
        } catch (e) {
          return value;
        }
      }
    }
    if (typeof value === 'object' && value !== null) return JSON.stringify(value);
    if (value === null || value === undefined || value === '') return '-';
    return value;
  };

  return (
    <div className="overflow-x-auto mt-6">
      {tableData.length === 0 ? (
        <div role="alert" className="alert my-2 mx-4">
          <TriangleAlert size={20} />
          <span>No hay datos para mostrar.</span>
        </div>
      ) : (
        <>
          <table className="table table-zebra w-full table-xs">
            <thead>
              <tr>
                <th>#</th>
                {columnsToShow.map((columna, index) => (
                  <th key={index}>{columna.label}</th>
                ))}
                {(onEdit || onDelete) && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item[uniqueKeyField] || index} className="hover:bg-base-300">
                  <th>{startIndex + index + 1}</th>
                  {columnsToShow.map((columna, colIndex) => {
                    let value = item[columna.key];
                    if (columna.key.includes('.')) {
                      const [parentKey, childKey] = columna.key.split('.');
                      value = item[parentKey]?.[childKey];
                    }
                    return <td key={colIndex}>{formatDisplayValue(value, columna.type)}</td>;
                  })}
                  {(onEdit || onDelete) && (
                    <td>
                      <div className="flex space-x-1">
                        {onEdit && (
                          <button
                            className="btn btn-xs mr-1"
                            onClick={() => onEdit(item)}
                            aria-label="Editar"
                          >
                            <SquarePen size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            className="btn btn-xs btn-error"
                            onClick={() => handleDeleteClick(item)}
                            aria-label="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="join mt-4 flex justify-center">
              <button
                className="join-item btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                «
              </button>
              <button className="join-item btn">Página {currentPage} de {totalPages}</button>
              <button
                className="join-item btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          )}
        </>
      )}

      {showDeleteModal && (
        <dialog id="delete_modal" className="modal modal-open" open>
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirmar Eliminación</h3>
            <p className="py-4">
              ¿Estás seguro de que deseas eliminar el registro{' '}
              <span className="font-semibold">
                {itemToDelete ? itemToDelete[uniqueKeyField] : ''}
              </span>
              ? Esta acción no se puede deshacer.
            </p>
            <div className="modal-action">
              <button className="btn btn-error" onClick={confirmDelete}>
                Eliminar
              </button>
              <button className="btn btn-ghost" onClick={cancelDelete}>
                Cancelar
              </button>
            </div>
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={cancelDelete}>
              <X size={16} />
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default DynamicTable;