import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router';
import { auth } from "../../../firebaseClient";
import { z } from "zod";

import {
  getUsers,
  getUserStats,
  getUserQuizAttempts,
  updateUserBase,
  updateUserSubscription,
  updateUserExperience,
  deleteUser,
} from "../../../helpers/apiHelpers";

import { UsuarioModel } from "../../../models/UsuarioModel";
import { EstadisticaModel } from "../../../models/EstadisticaModel";
import { IntentoQuizModel } from "../../../models/IntentoQuizModel";

import {
  UserBaseSchema,
  UserSubscriptionSchema,
  UserExperienceSchema,
} from "../../../Schemas/usuarioSchemas";

import DynamicFormCard from "./DynamicFormCard";
import DynamicTable from "./DynamicTable";
import Alert from "../../shared/Alert";

export const UsuariosCRUD = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const navigate = useNavigate();

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

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsuarios(data);
    } catch (error) {
      addAlert("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUserDetails = async (userId) => {
    try {
      const [stats, attempts] = await Promise.all([
        getUserStats(userId),
        getUserQuizAttempts(userId),
      ]);
      setUserStats(stats);
      setQuizAttempts(attempts || []);
    } catch (error) {
      console.error("Error loading user details:", error);
      setUserStats(null);
      setQuizAttempts(null);
    }
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setOriginalUser(user);
    loadUserDetails(user.id);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      // Validar datos antes de enviar
      const baseData = UserBaseSchema.parse({
        username: selectedUser.username,
        email: selectedUser.email,
        rol: selectedUser.rol,
      });

      const subscriptionData = selectedUser.suscripcion
        ? UserSubscriptionSchema.parse(selectedUser.suscripcion)
        : null;

      const experienceData = selectedUser.exp
        ? UserExperienceSchema.parse(selectedUser.exp)
        : 'null';

      const oldSubscriptionData = originalUser.suscripcion
        ? UserSubscriptionSchema.parse(originalUser.suscripcion)
        : null;

      const oldExperienceData = originalUser.exp
        ? UserExperienceSchema.parse(originalUser.exp)
        : 'null';

      const updates = [];

      // Actualizar datos base (PUT)
      updates.push(updateUserBase(selectedUser.id, baseData));

      // Actualizar suscripción si hay cambios (PATCH)
      if (JSON.stringify(subscriptionData) !== JSON.stringify(oldSubscriptionData)) {
        updates.push(updateUserSubscription(selectedUser.id, subscriptionData));
      }

      // Actualizar experiencia si hay cambios (PATCH)
      if (JSON.stringify(experienceData) !== JSON.stringify(oldExperienceData)) {
        updates.push(updateUserExperience(selectedUser.id, experienceData));
      }

      // Esperar a que todas las actualizaciones terminen
      await Promise.all(updates);

      if (selectedUser.id === auth.currentUser?.uid) {
        await auth.signOut();
        navigate('/');
        return;
      }

      addAlert("success", "Usuario actualizado correctamente");
      loadUsers();
      setSelectedUser(null);
      setOriginalUser(null);
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

  const handleDeleteUser = async (userId) => {
    setLoading(true);
    try {
      await deleteUser(userId);
      addAlert("success", "Usuario eliminado correctamente");
      loadUsers();
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
        setOriginalUser(null);
      }
    } catch (error) {
      addAlert("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="flex flex-col space-y-4 p-2 md:p-4">
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
        <div className="flex-1 min-w-0">
          {selectedUser ? (
            <>
              <DynamicFormCard
                model={UsuarioModel}
                data={selectedUser}
                onDataChange={setSelectedUser}
              />
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
                <button
                  className={`btn btn-primary ${loading ? "loading" : ""}`}
                  onClick={handleSaveUser}
                  disabled={loading}
                >
                  Guardar Cambios
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    setSelectedUser(null);
                    setOriginalUser(null);
                  }}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 min-w-0">
                <DynamicFormCard model={UsuarioModel} />
              </div>
              <div className="flex-1 flex flex-col gap-4 min-w-0">
                <div className="border-2 border-dashed border-gray-400 rounded-lg p-6 flex flex-col items-center justify-center h-full min-h-[120px] text-center text-gray-500">
                  Selecciona un usuario para poder visualizar sus estadísticas/intentos de quiz
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sección de detalles del usuario */}
        {selectedUser && (
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <div className="card bg-base-200 p-4">
              <h2 className="text-xl font-bold mb-4">Estadísticas</h2>
              {userStats ? (
                <>
                  <div className="overflow-x-auto">
                    <DynamicFormCard
                      model={EstadisticaModel}
                      data={userStats}
                      readOnly
                    />
                  </div>
                </>
              ) : (
                <Alert type="error" message="No se encontraron estadísticas" />
              )}
            </div>
            <div className="card bg-base-200 p-4">
              <h2 className="text-xl font-bold mb-4">Intentos de Quiz</h2>
              {quizAttempts === null ? (
                <Alert
                  type="error"
                  message="Este usuario no tiene intentos de quiz registrados"
                />
              ) : quizAttempts.length > 0 ? (
                <DynamicTable
                  model={IntentoQuizModel}
                  data={quizAttempts}
                  uniqueKeyField="id_intento"
                  itemsPerPage={5}
                />
              ) : (
                <Alert
                  type="error"
                  message="No se encontraron intentos de quiz"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tabla de usuarios */}
      <div className="card bg-base-200 p-4">
        <h2 className="text-xl font-bold mb-4">Usuarios</h2>
        <button
          className={`btn ${loading ? "loading" : ""}`}
          onClick={loadUsers}
          disabled={loading}
        >
          Actualizar Lista
        </button>
        <div className="overflow-x-auto">
          <DynamicTable
            model={UsuarioModel}
            data={usuarios}
            onEdit={handleSelectUser}
            onDelete={handleDeleteUser}
            uniqueKeyField="id"
            itemsPerPage={5}
          />
        </div>
      </div>
    </div>
  );
};