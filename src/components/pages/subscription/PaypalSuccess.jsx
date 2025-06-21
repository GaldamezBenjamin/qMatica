import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { useUser } from "../../../context/UserContext";
import { CheckCircle } from "lucide-react";

const PaypalSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshUserData } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasProcessed, setHasProcessed] = useState(false);
  const [urlCleaned, setUrlCleaned] = useState(false);
  const [verificationDone, setVerificationDone] = useState(false);
  const [delayPassed, setDelayPassed] = useState(false);
  const isProcessing = useRef(false);

  const MAX_ATTEMPTS = 6;
  const DELAY_MS = 2000;

  const verifyWithRetry = async (subscriptionId, attempt = 1) => {
    try {
      const verificationRes = await fetch(
        `/api/paypal/verify-subscription?subscription_id=${subscriptionId}`
      );
      
      if (!verificationRes.ok) {
        throw new Error(verificationRes.statusText);
      }

      const data = await verificationRes.json();
      console.log("Verification response:", data);

      // Cambia aquí: ahora verifica que data.success sea true
      if (data.success === true) {
        return true;
      } else if (attempt >= MAX_ATTEMPTS) {
        throw new Error("La suscripción no está activa. Intenta más tarde.");
      } else {
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        return verifyWithRetry(subscriptionId, attempt + 1);
      }
    } catch (err) {
      console.error("Verification error:", err);
      throw err;
    }
  };

  // Espera 10 segundos antes de permitir la verificación
  useEffect(() => {
    const timer = setTimeout(() => setDelayPassed(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleSuccess = useCallback(async () => {
    if (!delayPassed) return; // Espera a que pase el delay
    if (isProcessing.current || hasProcessed) return;
    isProcessing.current = true;

    try {
      const params = new URLSearchParams(location.search);
      const subscriptionId = params.get("subscription_id");

      if (!subscriptionId) {
        // Si la URL ya está limpia y la verificación se hizo, marca como procesado
        if (verificationDone && !hasProcessed) {
          setHasProcessed(true);
        }
        return;
      }

      // 1. Verificación con reintentos
      await verifyWithRetry(subscriptionId);

      // 2. Actualizar datos del usuario (solo una vez)
      await refreshUserData();

      setVerificationDone(true);

      // 3. Limpiar parámetros de URL para evitar recargas
      if (!urlCleaned) {
        setUrlCleaned(true);
        navigate(window.location.pathname, { replace: true });
        return;
      }
      // Si llegamos aquí, marcamos como procesado
      setHasProcessed(true);
    } catch (err) {
      console.error("Error en PaypalSuccess:", err);
      setError(err.message);
      // Redirigir a página de error después de un tiempo
      setTimeout(() => {
        navigate('/', {
          state: { 
            error: err.message,
            errorCode: `PP${Date.now().toString().slice(-6)}`
          }
        });
      }, 5000);
    } finally {
      setIsLoading(false);
      isProcessing.current = false;
    }
  }, [location.search, refreshUserData, navigate, hasProcessed, urlCleaned, verificationDone, delayPassed]);

  useEffect(() => {
    handleSuccess();
  }, [location.search, handleSuccess]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen animated-gradient-bg">
        <span className="loading loading-spinner loading-xl"></span>
        <p className="mt-4 text-lg">Activando tu suscripción...</p>
        <p className="text-sm text-gray-500 mt-2">
          Esto puede tomar unos momentos. Por favor no cierres esta página.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 animated-gradient-bg">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h2 className="font-bold text-xl mb-2 text-red-800">Error en la activación</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="bg-red-100 p-3 rounded-md">
            <p className="text-sm text-red-800">
              Redirigiéndote a la página de inicio...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] overflow-hidden px-4 animated-gradient-bg">
      <div className="glass p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          ¡Bienvenido a QMat Plus!
        </h1>
        <p className="text-gray-200 mb-6">
          Tu suscripción está activa y lista para usar.
        </p>
        
        <div className="bg-gray-50/20 p-4 rounded-md mb-6 text-left">
          <h3 className="font-semibold mb-2 text-white">Tus beneficios:</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-100">
            <li>Quizzes premium ilimitados</li>
            <li>Estadísticas avanzadas</li>
            <li>Contenido exclusivo</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="/quizzes/creador"
            className="btn glass w-full text-white"
          >
            Explorar Quizzes Premium
          </a>
          <a
            href="/user"
            className="btn glass w-full text-white"
          >
            Ver mi perfil
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaypalSuccess;

// Fondo animado igual que en Subscription.jsx
if (typeof window !== "undefined" && !document.getElementById("qmat-gradient-style-paypalsuccess")) {
  const style = document.createElement("style");
  style.id = "qmat-gradient-style-paypalsuccess";
  style.innerHTML = `
    .animated-gradient-bg {
      background: linear-gradient(270deg, #f0596c, #824894, #f0596c, #824894);
      background-size: 400% 400%;
      animation: qmat-gradient 50s ease-in-out infinite;
    }
    @keyframes qmat-gradient {
      0% {background-position:0% 50%}
      50% {background-position:100% 50%}
      100% {background-position:0% 50%}
    }
  `;
  document.head.appendChild(style);
}