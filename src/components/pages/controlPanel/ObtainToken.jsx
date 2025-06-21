// Example component or function in your React app
import React, { useState } from "react";
import { auth } from "../../../firebaseClient";
import { Copy, Check } from "lucide-react";

export const LoginComponent = () => {
  const [idToken, setIdToken] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const handleShowToken = async () => {
    setMessage("");
    setIdToken("");
    setUserId("");
    setCopiedToken(false);
    setCopiedUid(false);

    try {
      const user = auth.currentUser;
      if (!user) {
        setMessage("No hay usuario autenticado.");
        return;
      }
      const token = await user.getIdToken();
      setIdToken(token);
      setUserId(user.uid);
      setMessage("¡Token e ID obtenidos correctamente!");
      setShowToken(true);
    } catch (error) {
      setMessage(`No se pudo obtener el token: ${error.message}`);
    }
  };

  const handleCopyToken = () => {
    if (!idToken) return;
    navigator.clipboard.writeText(idToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 1500);
  };

  const handleCopyUid = () => {
    if (!userId) return;
    navigator.clipboard.writeText(userId);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 1500);
  };

  return (
    <div className="card bg-base-200 p-8 max-w-5/5 mx-auto my-2 w-full">
      <h2 className="text-xl font-bold mb-4">
        Obtener Firebase ID Token e ID de Usuario
      </h2>
      <div className="flex flex-col gap-4">
        <button
          className="btn btn-outline w-full"
          onClick={handleShowToken}
          disabled={showToken}
        >
          Mostrar token e ID
        </button>
        {showToken && (idToken || userId) && (
          <div className="mt-4 flex flex-col gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Tu Firebase ID Token:</h3>
                <button
                  className="btn btn-xs btn-outline flex items-center gap-1"
                  onClick={handleCopyToken}
                  type="button"
                >
                  {copiedToken ? (
                    <>
                      <Check size={16} className="text-success" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copiar
                    </>
                  )}
                </button>
              </div>
              <textarea
                readOnly
                value={idToken}
                rows={8}
                className="textarea textarea-bordered w-full text-xs"
                style={{ wordBreak: "break-all", resize: "none" }}
              />
              <p className="text-xs text-gray-500 mt-2">
                Copia este token y pégalo en tu archivo <code>users.rest</code> o
                donde lo necesites.
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Tu Firebase User ID:</h3>
                <button
                  className="btn btn-xs btn-outline flex items-center gap-1"
                  onClick={handleCopyUid}
                  type="button"
                >
                  {copiedUid ? (
                    <>
                      <Check size={16} className="text-success" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copiar
                    </>
                  )}
                </button>
              </div>
              <input
                type="text"
                readOnly
                value={userId}
                className="input input-bordered w-full text-xs"
              />
              <p className="text-xs text-gray-500 mt-2">
                Este es tu identificador único de usuario en Firebase.
              </p>
            </div>
          </div>
        )}
        {message && (
          <div
            className={`text-center ${
              idToken ? "text-success" : "text-error"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};
