import React, { useState, useEffect } from "react";
import { z } from "zod";

import {
  createForo,
  getForos,
  getForoByID,
  updateForo,
  deleteForo,
  createMensajeForo,
  getMensajesFromForo,
  getMensajeByID,
  updateMensajeForo,
  deleteMensajeForo,
} from "../../../Helpers/apiHelpers";

import { ForoModel } from "../../../models/ForoModel";
import { MensajeForoModel } from "../../../models/MensajeForoModel";

import {
  createForumSchema,
  updateForumSchema
} from "../../../Schemas/foroSchemas";

import {
  createForumMessageSchema,
  updateForumMessageSchema
} from "../../../Schemas/mensajeForoSchemas";

import DynamicFormCard from "./DynamicFormCard";
import DynamicTable from "./DynamicTable";
import Alert from "../../shared/Alert";

export const ForosCRUD = () => {
  // Estados para foros
  const [foros, setForos] = useState([]);
  const [selectedForo, setSelectedForo] = useState(null);
  
  // Estados para mensajes
  const [mensajes, setMensajes] = useState([]);
  const [selectedMensaje, setSelectedMensaje] = useState(null);
  const [showMensajes, setShowMensajes] = useState(false);
  
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
      const forosData = await getForos();
      setForos(forosData);
      
      // Si hay un foro seleccionado, cargar sus mensajes
      if (selectedForo?.id_foro) {
        const mensajesData = await getMensajesFromForo(selectedForo.id_foro);
        setMensajes(mensajesData);
      }
    } catch (error) {
      addAlert("error", "Error al cargar datos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejo de foros
  const handleSelectForo = async (foro) => {
    setSelectedForo(foro);
    setSelectedMensaje(null);
    setShowMensajes(true);
    
    try {
      setLoading(true);
      const mensajesData = await getMensajesFromForo(foro.id_foro);
      setMensajes(mensajesData);
    } catch (error) {
      addAlert("error", "Error al cargar mensajes: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveForo = async () => {
    if (!selectedForo) return;

    setLoading(true);
    try {
      if (selectedForo.id_foro) {
        // Actualizar foro existente
        const { id_foro } = selectedForo;
        const validatedData = updateForumSchema.parse({
          titulo: selectedForo.titulo,
          descripcion: selectedForo.descripcion,
        });
        await updateForo(id_foro, validatedData);
        addAlert("success", "Foro actualizado correctamente");
      } else {
        // Crear nuevo foro
        const validatedData = createForumSchema.parse(selectedForo);
        await createForo(validatedData);
        addAlert("success", "Foro creado correctamente");
      }
      
      loadData();
      setSelectedForo(null);
      setShowMensajes(false);
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

  const handleDeleteForo = async (id) => {
    setLoading(true);
    try {
      await deleteForo(id);
      addAlert("success", "Foro eliminado correctamente");
      loadData();
      if (selectedForo?.id_foro === id) {
        setSelectedForo(null);
        setShowMensajes(false);
      }
    } catch (error) {
      addAlert("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejo de mensajes
  const handleSelectMensaje = (mensaje) => {
    setSelectedMensaje(mensaje);
  };

  const handleSaveMensaje = async () => {
    if (!selectedMensaje) return;

    setLoading(true);
    try {
      if (selectedMensaje.id_mensaje) {
        // Actualizar mensaje existente
        const { id_mensaje } = selectedMensaje;
        const validatedData = updateForumMessageSchema.parse({
          contenido: selectedMensaje.contenido,
        });
        await updateMensajeForo(id_mensaje, validatedData);
        addAlert("success", "Mensaje actualizado correctamente");
      } else {
        // Crear nuevo mensaje
        const validatedData = createForumMessageSchema.parse({
          ...selectedMensaje,
          id_foro: selectedForo.id_foro // Asegurar que el mensaje pertenezca al foro
        });
        await createMensajeForo(validatedData);
        addAlert("success", "Mensaje creado correctamente");
      }
      
      loadData();
      setSelectedMensaje(null);
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

  const handleDeleteMensaje = async (id) => {
    setLoading(true);
    try {
      await deleteMensajeForo(id);
      addAlert("success", "Mensaje eliminado correctamente");
      loadData();
      if (selectedMensaje?.id_mensaje === id) {
        setSelectedMensaje(null);
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
        {/* Formulario de foro */}
        <div className={`${showMensajes ? "lg:w-1/3" : "flex-1"} card bg-base-200 p-4`}>
          <h2 className="text-xl font-bold mb-4">
            {selectedForo?.id_foro ? "Editar Foro" : "Crear Nuevo Foro"}
          </h2>
          <DynamicFormCard
            model={ForoModel}
            data={selectedForo || {}}
            onDataChange={setSelectedForo}
          />
          {selectedForo && (
            <div className="flex space-x-2 mt-4">
              <button
                className={`btn btn-primary ${loading ? "loading" : ""}`}
                onClick={handleSaveForo}
                disabled={loading}
              >
                Guardar Cambios
              </button>
              <button
                className="btn"
                onClick={() => {
                  setSelectedForo(null);
                  setShowMensajes(false);
                }}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Formulario de mensajes (solo visible cuando hay un foro seleccionado) */}
        {showMensajes && (
          <div className="lg:w-2/3 card bg-base-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedMensaje?.id_mensaje ? "Editar Mensaje" : "Crear Nuevo Mensaje"} - {selectedForo?.nombre}
              </h2>
              <button
                className="btn btn-sm"
                onClick={() => setShowMensajes(false)}
              >
                Cerrar mensajes
              </button>
            </div>
            
            <DynamicFormCard
              model={MensajeForoModel}
              data={selectedMensaje || {}}
              onDataChange={setSelectedMensaje}
            />
            
            {selectedMensaje && (
              <div className="flex space-x-2 mt-4">
                <button
                  className={`btn btn-primary ${loading ? "loading" : ""}`}
                  onClick={handleSaveMensaje}
                  disabled={loading}
                >
                  Guardar Mensaje
                </button>
                <button
                  className="btn"
                  onClick={() => setSelectedMensaje(null)}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabla de foros */}
      <div className="card bg-base-200 p-4">
        <h2 className="text-xl font-bold mb-4">Foros</h2>
        <button
          className={`btn mb-4 ${loading ? "loading" : ""}`}
          onClick={loadData}
          disabled={loading}
        >
          Actualizar Lista
        </button>
        <DynamicTable
          model={ForoModel}
          data={foros}
          onEdit={handleSelectForo}
          onDelete={handleDeleteForo}
          uniqueKeyField="id_foro"
          itemsPerPage={5}
        />
      </div>

      {/* Tabla de mensajes (solo visible cuando hay un foro seleccionado) */}
      {showMensajes && (
        <div className="card bg-base-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Mensajes del Foro: {selectedForo?.nombre}</h2>
          </div>
          
          <DynamicTable
            model={MensajeForoModel}
            data={mensajes}
            onEdit={handleSelectMensaje}
            onDelete={handleDeleteMensaje}
            uniqueKeyField="id_mensaje"
            itemsPerPage={5}
          />
        </div>
      )}
    </div>
  );
};