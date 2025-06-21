import { Check, Crown, BarChart2, Download, Award, Star } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { auth } from "../../../firebaseClient";
import { useUser } from "../../../context/UserContext";

// Cambia esto por tu plan_id real de PayPal
const PAYPAL_PLAN_ID = import.meta.env.VITE_PAYPAL_PLAN_ID || "TU_PLAN_ID_AQUI";

const SubscPage = () => {
  return (
    <div className="min-h-screen flex flex-col animated-gradient-bg">
      <div className="bg-white/10 backdrop-blur-lg text-white">
        <SubMainSec />
      </div>
    </div>
  );
};

export default SubscPage;

const SubMainSec = () => {
  const [loading, setLoading] = useState(false);
  const { currentUser, isAdmin, isSubscribed } = useAuth();
  const { refreshUserData } = useUser();
  // Puedes agregar más estados si necesitas manejar la cancelación

  // Función para cancelar la suscripción (debes implementar el endpoint backend)
  const handleCancel = async () => {
    if (!window.confirm("¿Seguro que deseas cancelar tu suscripción?")) return;
    setLoading(true);
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      const res = await fetch("/api/paypal/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId: currentUser?.uid }) // o el campo que uses
      });
      if (!res.ok) throw new Error("Error cancelando suscripción");
      alert("Suscripción cancelada.");
      await refreshUserData();
      // Aquí podrías actualizar el estado global o recargar la página
    } catch (err) {
      alert("Ocurrió un error al cancelar.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Crown className="w-8 h-8 text-yellow-300" />,
      title: "Acceso Completo",
      description: "Desbloquea todos los quizzes sin restricciones de dificultad."
    },
    {
      icon: <BarChart2 className="w-8 h-8 text-blue-500" />,
      title: "Quizzes Personalizados",
      description: "Recibe contenido adaptado a tu nivel y áreas de interés."
    },
    {
      icon: <Download className="w-8 h-8 text-green-300" />,
      title: "Estadísticas Detalladas",
      description: "Accede a informes completos de tu progreso y rendimiento."
    },
    {
      icon: <Award className="w-8 h-8 text-purple-500" />,
      title: "Reconocimientos",
      description: "Obtén logros y medallas por tu avance y dedicación."
    }
  ];

  // Función para iniciar el proceso de suscripción con PayPal
  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      const res = await fetch("/api/paypal/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ plan_id: PAYPAL_PLAN_ID })
      });
      if (!res.ok) throw new Error("Error iniciando suscripción");
      const data = await res.json();
      const approveLink = data.links?.find(link => link.rel === "approve");
      if (approveLink) {
        window.location.href = approveLink.href; // Redirige a PayPal
      } else {
        alert("No se pudo iniciar la suscripción.");
      }
    } catch (err) {
      alert("Ocurrió un error al conectar con PayPal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-4">
          <Crown className="w-12 h-12 text-yellow-400 fill-yellow-400" />
        </div>
        <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
          Suscripción <span className="text-yellow-400">QMat Plus</span>
        </h1>
        <p className="text-lg text-gray-200 max-w-2xl mx-auto">
          Accede a la experiencia completa de aprendizaje con nuestra suscripción mensual.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {features.map((feature, index) => (
          <div key={index} className="card glass shadow-lg hover:shadow-xl transition-shadow">
            <div className="card-body items-center text-center">
              <div className="p-3 rounded-full bg-white/20 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-white card-title text-xl">{feature.title}</h3>
              <p className="text-gray-200">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Estado de suscripción */}
      {isSubscribed ? (
        <div className="mb-10 text-center">
          <h2 className="text-yellow-400 text-4xl font-bold mb-2">¡Ya eres suscriptor QMat Plus!</h2>
          <p className="text-white mb-4">
            Disfruta de todos los beneficios de tu suscripción. Si deseas, puedes cancelar en cualquier momento.
          </p>
          <button
            className="btn glass btn-outline"
            onClick={handleCancel}
            disabled={loading}
          >
            {loading ? "Cancelando..." : "Cancelar suscripción"}
          </button>
        </div>
      ) : (
        <>
          {/* Single Pricing Plan */}
          <div className="mb-20 text-center">
            <h2 className="text-white text-3xl font-bold mb-8">Plan Mensual</h2>
            <div className="card bg-gradient-to-t from-yellow-500 to-yellow-600/10 text-white shadow-2xl max-w-md mx-auto">
              <div className="card-body items-center text-center">
                <Crown className="w-12 h-12 mb-4 fill-white" />
                <h3 className="card-title text-2xl mb-2">Suscripción Mensual</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$2.50</span>
                  <span className="text-yellow-200"> / mes (USD)</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-white" />
                    <span>Acceso completo a todos los quizzes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-white" />
                    <span>Quizzes personalizados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-white" />
                    <span>Estadísticas detalladas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-white" />
                    <span>Reconocimientos y medallas</span>
                  </li>
                </ul>
                <button
                  className="btn btn-outline btn-lg w-full"
                  onClick={handleSubscribe}
                  disabled={loading}
                >
                  {loading ? "Redirigiendo a PayPal..." : "Suscribirse ahora"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Testimonials */}
      <div className="mb-20">
        <h2 className="text-white text-3xl font-bold text-center mb-12">Experiencias de Usuarios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              quote: "La suscripción me permitió practicar sin límites y mejorar mucho más rápido. ¡Recomendado!",
              author: "María G.",
              rating: 5
            },
            {
              quote: "Las estadísticas detalladas me ayudan a enfocar mis estudios donde más lo necesito.",
              author: "Carlos P.",
              rating: 5
            }
          ].map((testimonial, index) => (
            <div key={index} className="card glass shadow-lg">
              <div className="card-body">
                <div className="flex mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-white italic mb-4">"{testimonial.quote}"</p>
                <p className="text-white font-semibold text-right">— {testimonial.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      { !isSubscribed && (
      <div className="text-center">
        <h2 className="text-white text-3xl font-bold mb-6">¿Listo para suscribirte?</h2>
        <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
          Únete a nuestra comunidad de aprendizaje y lleva tus conocimientos al siguiente nivel.
        </p>
        <button
          className="btn btn-outline btn-lg gap-2"
          onClick={handleSubscribe}
          disabled={loading}
        >
          <Crown className="w-5 h-5" />
          {loading ? "Redirigiendo a PayPal..." : "Suscríbete"}
        </button>
      </div>
      )}
    </section>
  );
};

if (typeof window !== "undefined" && !document.getElementById("qmat-gradient-style-subscription")) {
  const style = document.createElement("style");
  style.id = "qmat-gradient-style-subscription";
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