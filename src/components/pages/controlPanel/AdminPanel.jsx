import React, { useState, useEffect, useCallback } from 'react';
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import CollectionTable from './CollectionTable';
import DocumentForm from './DocumentForm';

const AdminPanel = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>
      <MainSection />
      <Footer/>
    </div>
  );
};

export default AdminPanel;

function MainSection() {
  const [selectedCollection, setSelectedCollection] = useState('quizzes'); // Estado para la colección actual
  const [documents, setDocuments] = useState([]); // Documentos de la colección actual
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingDocument, setEditingDocument] = useState(null); // Documento para editar (null si es crear)

  // Definición de columnas para cada tipo de colección
  const collectionColumns = {
    quizzes: [
      { key: 'id_quiz', label: 'ID Quiz' }, // Es necesario que tu backend devuelva el ID
      { key: 'nombre', label: 'Nombre' },
      { key: 'dificultad', label: 'Dificultad' },
      { key: 'cantidad_preguntas', label: 'Preguntas' },
      { key: 'tiempo_estimado', label: 'Tiempo (min)' },
      { key: 'preguntas', label: 'IDs Preguntas' },
    ],
    categorias: [
      { key: 'id_categoria', label: 'ID Categoría' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'descripcion', label: 'Descripción' },
      { key: 'id_super_cat', label: 'ID Super Cat.' },
    ],
    super_categorias: [
      { key: 'id_super_cat', label: 'ID Super Cat.' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'paes', label: 'PAES' },
      { key: 'categorias', label: 'IDs Categorías' },
    ],
    // Añade más colecciones según las necesites
  };

  // URL base de la API, incluyendo la versión
  const API_BASE_URL = '/api/v1';

  // Función para obtener documentos de una colección
  const fetchDocuments = useCallback(async (collectionName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${collectionName}`);
      if (!response.ok) {
        throw new Error(`Error al obtener ${collectionName}: ${response.statusText}`);
      }
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []); // Dependencias vacías, solo se crea una vez

  // Efecto para cargar documentos cuando cambia la colección seleccionada
  useEffect(() => {
    fetchDocuments(selectedCollection);
  }, [selectedCollection, fetchDocuments]);

  // Manejadores de CRUD
  const handleCreateOrUpdate = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      let method;
      let url;
      let docId = formData.id_quiz || formData.id_categoria || formData.id_super_cat; // Obtener el ID dinámicamente

      if (editingDocument) { // Si estamos editando
        method = 'PUT';
        url = `${API_BASE_URL}/${selectedCollection}/${docId}`;
      } else { // Si estamos creando
        method = 'POST';
        url = `${API_BASE_URL}/${selectedCollection}`;
      }

      response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al ${editingDocument ? 'actualizar' : 'crear'} el documento: ${errorData.message || response.statusText}`);
      }

      // Si la operación fue exitosa, recarga los documentos y limpia el formulario
      fetchDocuments(selectedCollection);
      setEditingDocument(null); // Limpiar el formulario de edición
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${selectedCollection}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al eliminar el documento: ${errorData.message || response.statusText}`);
      }

      // Si la eliminación fue exitosa, recarga los documentos
      fetchDocuments(selectedCollection);
      setEditingDocument(null); // Asegúrate de limpiar el formulario si el documento editado fue eliminado
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doc) => {
    setEditingDocument(doc);
  };

  const handleCancelEdit = () => {
    setEditingDocument(null);
  };

  return (
    <main className="flex-1 p-8 bg-gray-100">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Panel de Administración de Datos</h1>

        {/* Selector de Colección */}
        <div className="mb-8 p-6 bg-white shadow-md rounded-lg">
          <label htmlFor="collection-select" className="block text-lg font-medium text-gray-700 mb-2">
            Selecciona una colección:
          </label>
          <select
            id="collection-select"
            value={selectedCollection}
            onChange={(e) => {
              setSelectedCollection(e.target.value);
              setEditingDocument(null); // Resetear el formulario al cambiar de colección
            }}
            className="mt-1 block w-full md:w-1/3 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="quizzes">Quizzes</option>
            <option value="categorias">Categorías</option>
            <option value="super_categorias">Super Categorías</option>
            {/* Añade más opciones si tienes más colecciones */}
          </select>
        </div>

        {/* Mensajes de estado */}
        {loading && <p className="text-blue-600 text-center text-lg mb-4">Cargando...</p>}
        {error && <p className="text-red-600 text-center text-lg mb-4">Error: {error}</p>}

        {/* Tabla de Documentos */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Documentos en "{selectedCollection}"
          </h2>
          <CollectionTable
            documents={documents}
            columns={collectionColumns[selectedCollection]}
            onEdit={handleEdit}
            onDelete={handleDelete}
            documentType={selectedCollection.slice(0, -1)} // Pasa el tipo singular (quiz, categoria)
          />
        </div>

        {/* Formulario de Creación/Edición */}
        <DocumentForm
          documentType={selectedCollection}
          initialData={editingDocument}
          onSubmit={handleCreateOrUpdate}
          onCancel={handleCancelEdit}
        />
      </div>
    </main>
  );
}