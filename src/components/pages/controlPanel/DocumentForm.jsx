// qmatica-frontend/src/components/DocumentForm.jsx
import React, { useState, useEffect } from 'react';

const DocumentForm = ({ documentType, initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {});
  const isEditing = initialData && (initialData.id_quiz || initialData.id_categoria || initialData.id_super_cat);

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Manejar booleanos o números si es necesario
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const handleArrayChange = (e, fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: e.target.value.split(',').map(item => item.trim()) // Convierte string separado por comas en array
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Define los campos del formulario según el tipo de documento
  const renderFormFields = () => {
    switch (documentType) {
      case 'quizzes':
        return (
          <>
            <label className="block text-sm font-medium text-gray-700">Nombre:</label>
            <input type="text" name="nombre" value={formData.nombre || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />

            <label className="block text-sm font-medium text-gray-700 mt-4">Dificultad (1-4):</label>
            <input type="number" name="dificultad" value={formData.dificultad || ''} onChange={handleChange} min="1" max="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />

            <label className="block text-sm font-medium text-gray-700 mt-4">Cantidad de Preguntas:</label>
            <input type="number" name="cantidad_preguntas" value={formData.cantidad_preguntas || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />

            <label className="block text-sm font-medium text-gray-700 mt-4">Tiempo Estimado (min):</label>
            <input type="number" name="tiempo_estimado" value={formData.tiempo_estimado || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />

            <label className="block text-sm font-medium text-gray-700 mt-4">Preguntas (IDs separados por coma):</label>
            <input type="text" name="preguntas" value={formData.preguntas ? formData.preguntas.join(', ') : ''} onChange={(e) => handleArrayChange(e, 'preguntas')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </>
        );
      case 'categorias':
        return (
          <>
            <label className="block text-sm font-medium text-gray-700">Nombre:</label>
            <input type="text" name="nombre" value={formData.nombre || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />

            <label className="block text-sm font-medium text-gray-700 mt-4">Descripción:</label>
            <textarea name="descripcion" value={formData.descripcion || ''} onChange={handleChange} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required></textarea>

            <label className="block text-sm font-medium text-gray-700 mt-4">ID Super Categoría (Opcional):</label>
            <input type="text" name="id_super_cat" value={formData.id_super_cat || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </>
        );
      case 'super_categorias':
        return (
          <>
            <label className="block text-sm font-medium text-gray-700">Nombre:</label>
            <input type="text" name="nombre" value={formData.nombre || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />

            <label className="block text-sm font-medium text-gray-700 mt-4">PAES:</label>
            <input type="text" name="paes" value={formData.paes || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />

            <label className="block text-sm font-medium text-gray-700 mt-4">Categorías (IDs separados por coma):</label>
            <input type="text" name="categorias" value={formData.categorias ? formData.categorias.join(', ') : ''} onChange={(e) => handleArrayChange(e, 'categorias')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </>
        );
      default:
        return <p>Selecciona una colección para ver el formulario.</p>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">{isEditing ? `Editar ${documentType.slice(0, -1)}` : `Crear ${documentType.slice(0, -1)}`}</h2>
      <form onSubmit={handleSubmit}>
        {renderFormFields()}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEditing ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentForm;