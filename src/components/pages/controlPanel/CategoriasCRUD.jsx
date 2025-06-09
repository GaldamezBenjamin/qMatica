import React, { useState, useEffect } from "react";
import { z } from "zod";

import {
  createCategoria,
  getCategorias,
  getCategoriaByID,
  updateCategoria,
  deleteCategoria,
  createSubCategoria,
  getSubCategorias,
  getSubCategoriaByID,
  updateSubCategoria,
  deleteSubCategoria,
} from "../../../Helpers/apiHelpers";

import { CategoriaModel } from "../../../models/CategoriaModel";
import { SubCategoriaModel } from "../../../models/SubCategoriaModel";

import {
  createCategorySchema,
  updateCategorySchema
} from "../../../Schemas/categoriaSchemas";

import {
  createSubCategorySchema,
  updateSubCategorySchema
} from "../../../Schemas/subCategoriaSchemas";

import DynamicFormCard from "./DynamicFormCard";
import DynamicTable from "./DynamicTable";
import Alert from "../../shared/Alert";

export const CategoriasCRUD = () => {
  // Estados para categorías
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  
  // Estados para subcategorías
  const [subCategorias, setSubCategorias] = useState([]);
  const [selectedSubCategoria, setSelectedSubCategoria] = useState(null);
  
  // Estado general
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const addAlert = (type, message, timeout = 5000) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, type, message }]);

    if (timeout) {
      setTimeout(() => removeAlert(id), timeout);
    }
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  // Cargar datos
  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, subCats] = await Promise.all([
        getCategorias(),
        getSubCategorias()
      ]);
      setCategorias(cats);
      setSubCategorias(subCats);
    } catch (error) {
      addAlert("error", "Error al cargar datos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejo de categorías
  const handleSelectCategoria = (categoria) => {
    setSelectedCategoria(categoria);
    setSelectedSubCategoria(null); // Deseleccionar subcategoría si había una seleccionada
  };

  const handleSaveCategoria = async () => {
    if (!selectedCategoria) return;

    setLoading(true);
    try {
      // Actualizar categoría existente - excluimos el id para la validación
      if (selectedCategoria.id_categoria) {
        const { id_categoria, ...dataToValidate } = selectedCategoria;
        const validatedData = updateCategorySchema.parse(dataToValidate);
        await updateCategoria(selectedCategoria.id_categoria, validatedData);
        addAlert("success", "Categoría actualizada correctamente");
      } else {
        // Crear nueva categoría
        const validatedData = createCategorySchema.parse(selectedCategoria);
        await createCategoria(validatedData);
        addAlert("success", "Categoría creada correctamente");
      }
      
      loadData();
      setSelectedCategoria(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          addAlert("error", `${err.path.join(".")}: ${err.message}`);
        });
      } else {
        addAlert("error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategoria = async (id) => {
    setLoading(true);
    try {
      await deleteCategoria(id);
      addAlert("success", "Categoría eliminada correctamente");
      loadData();
      if (selectedCategoria?.id_categoria === id) {
        setSelectedCategoria(null);
      }
    } catch (error) {
      addAlert("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejo de subcategorías
  const handleSelectSubCategoria = (subCategoria) => {
    setSelectedSubCategoria(subCategoria);
    setSelectedCategoria(null); // Deseleccionar categoría si había una seleccionada
  };

  const handleSaveSubCategoria = async () => {
    if (!selectedSubCategoria) return;

    setLoading(true);
    try {
      if (selectedSubCategoria.id_subcategoria) {
        // Actualizar subcategoría existente - excluimos el id para la validación
        const { id_subcategoria, ...dataToValidate } = selectedSubCategoria;
        const validatedData = updateSubCategorySchema.parse(dataToValidate);
        await updateSubCategoria(selectedSubCategoria.id_subcategoria, validatedData);
        addAlert("success", "Subcategoría actualizada correctamente");
      } else {
        // Crear nueva subcategoría
        const validatedData = createSubCategorySchema.parse(selectedSubCategoria);
        await createSubCategoria(validatedData);
        addAlert("success", "Subcategoría creada correctamente");
      }
      
      loadData();
      setSelectedSubCategoria(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          addAlert("error", `${err.path.join(".")}: ${err.message}`);
        });
      } else {
        addAlert("error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubCategoria = async (id) => {
    setLoading(true);
    try {
      await deleteSubCategoria(id);
      addAlert("success", "Subcategoría eliminada correctamente");
      loadData();
      if (selectedSubCategoria?.id_subcategoria === id) {
        setSelectedSubCategoria(null);
      }
    } catch (error) {
      addAlert("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex flex-col space-y-4 p-4">
      {/* Mostrar alertas */}
      <div className="space-y-2">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            type={alert.type}
            message={alert.message}
            onClose={() => removeAlert(alert.id)}
          />
        ))}
      </div>

      {/* Sección de formularios */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Formulario de categoría */}
        <div className="flex-1 card bg-base-200 p-4">
          <h2 className="text-xl font-bold mb-4">
            {selectedCategoria?.id_categoria ? "Editar Categoría" : "Crear Nueva Categoría"}
          </h2>
          <DynamicFormCard
            model={CategoriaModel}
            data={selectedCategoria || {}}
            onDataChange={setSelectedCategoria}
          />
          {selectedCategoria && (
            <div className="flex space-x-2 mt-4">
              <button
                className={`btn btn-primary ${loading ? "loading" : ""}`}
                onClick={handleSaveCategoria}
                disabled={loading}
              >
                Guardar Cambios
              </button>
              <button
                className="btn"
                onClick={() => setSelectedCategoria(null)}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Formulario de subcategoría */}
        <div className="flex-1 card bg-base-200 p-4">
          <h2 className="text-xl font-bold mb-4">
            {selectedSubCategoria?.id_subcategoria ? "Editar Subcategoría" : "Crear Nueva Subcategoría"}
          </h2>
          <DynamicFormCard
            model={SubCategoriaModel}
            data={selectedSubCategoria || {}}
            onDataChange={setSelectedSubCategoria}
          />
          {selectedSubCategoria && (
            <div className="flex space-x-2 mt-4">
              <button
                className={`btn btn-primary ${loading ? "loading" : ""}`}
                onClick={handleSaveSubCategoria}
                disabled={loading}
              >
                Guardar Cambios
              </button>
              <button
                className="btn"
                onClick={() => setSelectedSubCategoria(null)}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabla de categorías */}
      <div className="card bg-base-200 p-4">
        <h2 className="text-xl font-bold mb-4">Categorías</h2>
        <button
          className={`btn mb-4 ${loading ? "loading" : ""}`}
          onClick={loadData}
          disabled={loading}
        >
          Actualizar Lista
        </button>
        <DynamicTable
          model={CategoriaModel}
          data={categorias}
          onEdit={handleSelectCategoria}
          onDelete={handleDeleteCategoria}
          uniqueKeyField="id_categoria"
          itemsPerPage={5}
        />
      </div>

      {/* Tabla de subcategorías */}
      <div className="card bg-base-200 p-4">
        <h2 className="text-xl font-bold mb-4">Subcategorías</h2>
        <button
          className={`btn mb-4 ${loading ? "loading" : ""}`}
          onClick={loadData}
          disabled={loading}
        >
          Actualizar Lista
        </button>
        <DynamicTable
          model={SubCategoriaModel}
          data={subCategorias}
          onEdit={handleSelectSubCategoria}
          onDelete={handleDeleteSubCategoria}
          uniqueKeyField="id_subcategoria"
          itemsPerPage={5}
        />
      </div>
    </div>
  );
};