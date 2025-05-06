import React from 'react';
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import main1 from "../../../assets/images/main1.png";
import main3 from "../../../assets/images/main3.png";

const InicioPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <MainSection />
      <Footer />
    </div>
  );
};

export default InicioPage;

function MainSection() {
  return (
    <main className="bg-white">
      <section className="mx-auto">
        {/* Sección superior */}
        <div
          className="relative overflow-hidden"
          style={{
            backgroundImage: `url(${main3})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="px-4 py-12 sm:px-6 lg:px-8 md:py-0 md:h-full m-30">
            <div className="max-w-md mx-auto md:mx-0 md:text-left md:flex md:flex-col justify-center">
              <h1 className="text-6xl font-bold text-white mb-8">
                ¡Prepárate para la PAES con Quizzes Inteligentes!
              </h1>
              <p className="text-lg text-white sm:text-xl mb-2">
                Domina cada tema con quizzes personalizados y predictivos,
                diseñados para adaptarse a tu nivel y necesidades.
              </p>
              <div className="mt-4 sm:mt-6 md:mt-8 justify-center">
                <button className="bg-[#f0596c] text-white font-semibold py-2 px-4 w-75 rounded hover:bg-[#ff7184] focus:outline-none">
                  ¡Regístrate Ahora!
                </button>
              </div>
            </div>
          </div>
          {/* Div vacío para ocupar el lado izquierdo en pantallas medianas y superiores */}
          <div className="hidden md:block" aria-hidden="true" />
        </div>

        {/* Sección de características */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-30 mb-12 py-20 px-47">
          {/* Quizizzes con IA */}
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center h-20 w-20 mx-auto m-8">
              {/* Puedes reemplazar esto con un icono real */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <g data-name="15-idea">
                  <path d="M40 33h-6a1 1 0 0 1-1-1v-3.1a1 1 0 0 0-.6-.9 11 11 0 1 1 9.195 0 1 1 0 0 0-.6.908V32A1 1 0 0 1 40 33zm-5-2h4v-2.1a3.015 3.015 0 0 1 1.762-2.724A9 9 0 0 0 43 11.292a9 9 0 1 0-9.759 14.887A3.014 3.014 0 0 1 35 28.9z" />
                  <path d="M38 39h-2a3 3 0 0 1-3-3v-4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4a3 3 0 0 1-3 3zm-3-6v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3z" />
                  <path d="M34 34h6v2h-6z" />
                  <path d="M24 48a7 7 0 0 1-6.322-4.008A7.008 7.008 0 0 1 11 37v-.071a7.015 7.015 0 0 1-5.964-6.214 6.994 6.994 0 0 1 0-13.429A7.013 7.013 0 0 1 11 11.071V11a7.01 7.01 0 0 1 6.678-6.993A7.006 7.006 0 0 1 24 0a6.006 6.006 0 0 1 6 6h-2a4 4 0 0 0-4-4 5 5 0 0 0-4.714 3.349.976.976 0 0 1-1 .667l-.1-.007c-.06 0-.12-.009-.182-.009a5.006 5.006 0 0 0-5 5 4.9 4.9 0 0 0 .077.836 1.007 1.007 0 0 1-.227.82 1.028 1.028 0 0 1-.775.348h-.1A5 5 0 0 0 7 18a1.1 1.1 0 0 1-.831 1.076 4.993 4.993 0 0 0 0 9.849 1 1 0 0 1 .835 1v.1A5 5 0 0 0 12 35a1.093 1.093 0 0 1 .81.353 1.024 1.024 0 0 1 .267.81A4.923 4.923 0 0 0 13 37a5.006 5.006 0 0 0 5 5c.062 0 .122-.005.182-.009l.1-.007a1 1 0 0 1 1 .667A5 5 0 0 0 24 46a4 4 0 0 0 4-4 1 1 0 0 1 1-1h6a1 1 0 0 0 1-1v-2h2v2a3 3 0 0 1-3 3h-5.083A6.01 6.01 0 0 1 24 48z" />
                  <path d="M12 25a7.008 7.008 0 0 1-7-7h2a5.006 5.006 0 0 0 5 5zM18 44a7.008 7.008 0 0 1-7-7h2a5 5 0 1 0 5-5v-2a7 7 0 0 1 0 14zM18 18v-2a5 5 0 1 0-5-5h-2a7 7 0 1 1 7 7zM38 32h-2V19a1 1 0 0 1 1-1h3a1 1 0 0 0 1-1v-1h2v1a3 3 0 0 1-3 3h-2z" />
                  <path d="M37 20h-3a3 3 0 0 1-3-3v-1h2v1a1 1 0 0 0 1 1h3zM18 35h2v2h-2zM16 37h2v2h-2zM13 16h2v2h-2zM11 18h2v2h-2zM23 23h2v2h-2zM21 25h2v2h-2z" />
                </g>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 m-4">
              Quizzes con IA
            </h3>
            <p className="text-gray-600 text-sm">
              Adaptados al temario PAES y personalizados según tus debilidades.
            </p>
          </div>

          {/* Sistema de Rangos */}
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center h-20 w-20 mx-auto m-8">
              {/* Puedes reemplazar esto con un icono real */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                <path d="M37 32.811V28h1a3 3 0 0 0 0-6h-1v-3.382l7.447-3.723A1 1 0 0 0 45 14V1a1 1 0 0 0-2 0v12.382l-6 3V1a1 1 0 0 0-2 0v16h-6V1a1 1 0 0 0-2 0v15.382l-6-3V1a1 1 0 0 0-2 0v13a1 1 0 0 0 .553.894L27 18.619V22h-1a3 3 0 0 0 0 6h1v4.811a16 16 0 1 0 10 0zM29 19h6v3h-6zm-4 6a1.001 1.001 0 0 1 1-1h12a1 1 0 0 1 0 2H26a1.001 1.001 0 0 1-1-1zm4 7.282V28h6v4.282A18.755 18.755 0 0 0 32 32a18.755 18.755 0 0 0-3 .282zM32 62a13.997 13.997 0 1 1 14-14 14.016 14.016 0 0 1-14 14z" />
                <path d="M32 35a13 13 0 1 0 13 13 13.014 13.014 0 0 0-13-13zm0 24a11 11 0 1 1 11-11 11.012 11.012 0 0 1-11 11z" />
                <path d="M39.786 45.656a1 1 0 0 0-.808-.68l-4.202-.61-1.879-3.808a1.042 1.042 0 0 0-1.794 0l-1.879 3.807-4.202.61a1 1 0 0 0-.555 1.706l3.04 2.964-.717 4.186a1 1 0 0 0 1.451 1.054L32 52.91l3.759 1.976a1 1 0 0 0 1.451-1.054l-.718-4.186 3.04-2.964a1 1 0 0 0 .254-1.025zm-5.067 2.925a1.002 1.002 0 0 0-.287.884l.464 2.707-2.43-1.278a1.001 1.001 0 0 0-.931 0l-2.431 1.278.464-2.707a1.002 1.002 0 0 0-.287-.884l-1.966-1.917 2.717-.395a1 1 0 0 0 .753-.547L32 43.26l1.215 2.462a1 1 0 0 0 .753.547l2.717.395z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 m-4">
              Sistema de Rangos
            </h3>
            <p className="text-gray-600 text-sm">
              Gana experiencia, sube de nivel y desbloquea quizzes según tu
              nivel.
            </p>
          </div>

          {/* Estadísticas de Usuario */}
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center h-20 w-20 mx-auto m-8">
              {/* Puedes reemplazar esto con un icono real */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
                <g id="graph-bar">
                  <path d="M23.5 23H2V1.5a.5.5 0 0 0-1 0v22a.5.5 0 0 0 .5.5h22a.5.5 0 0 0 0-1z" />
                  <path d="M4.5 22h4a.5.5 0 0 0 .5-.5v-10a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5zM5 12h3v9H5zM10.5 22h4a.5.5 0 0 0 .5-.5v-15a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 0-.5.5v15a.5.5 0 0 0 .5.5zM11 7h3v14h-3zM16.5 22h4a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5zm.5-12h3v11h-3z" />
                </g>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 m-4">
              Estadísticas de Usuario
            </h3>
            <p className="text-gray-600 text-sm">
              Ve tus estadísticas detalladas de tu progreso y descubre tus
              debilidades por categorías.
            </p>
          </div>

          {/* Comunidad */}
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center h-20 w-20 mx-auto m-8">
              {/* Puedes reemplazar esto con un icono real */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <g id="Layer_2" data-name="Layer 2">
                  <g id="layer_1-2" data-name="layer 1">
                    <path d="M37 48a11 11 0 1 1 11-11 11 11 0 0 1-11 11zm0-20a9 9 0 1 0 9 9 9 9 0 0 0-9-9zM10 27.25l-2-.11A16 16 0 0 1 14.65 15l1.17 1.62A13.94 13.94 0 0 0 10 27.25z" />
                    <path d="M24 44a16.08 16.08 0 0 1-4.83-.74l.61-1.91a14.13 14.13 0 0 0 8.44 0l.6 1.91A16 16 0 0 1 24 44zM38 27.25a13.91 13.91 0 0 0-5.8-10.61L33.35 15A15.91 15.91 0 0 1 40 27.14zM37 40c-2.21 0-4-2.24-4-5a3.71 3.71 0 0 1 4-4 3.71 3.71 0 0 1 4 4c0 2.76-1.79 5-4 5zm0-7c-1.79 0-2 1.14-2 2 0 1.6.93 3 2 3s2-1.4 2-3c0-.86-.21-2-2-2z" />
                    <path d="M44 45h-2v-3.31a1 1 0 0 0-.84-1L37 40l-4.17.7a1 1 0 0 0-.83 1V45h-2v-3.31a3 3 0 0 1 2.51-2.95l4.33-.74h.32l4.33.73A3 3 0 0 1 44 41.69zM24 22a11 11 0 1 1 11-11 11 11 0 0 1-11 11zm0-20a9 9 0 1 0 9 9 9 9 0 0 0-9-9z" />
                    <path d="M24 14c-2.21 0-4-2.24-4-5a3.71 3.71 0 0 1 4-4 3.71 3.71 0 0 1 4 4c0 2.76-1.79 5-4 5zm0-7c-1.79 0-2 1.14-2 2 0 1.6.93 3 2 3s2-1.4 2-3c0-.86-.21-2-2-2z" />
                    <path d="M31 19h-2v-3.31a1 1 0 0 0-.84-1L24 14l-4.17.7a1 1 0 0 0-.83 1V19h-2v-3.31a3 3 0 0 1 2.51-2.95l4.33-.74h.32l4.33.73A3 3 0 0 1 31 15.69zM11 48a11 11 0 1 1 11-11 11 11 0 0 1-11 11zm0-20a9 9 0 1 0 9 9 9 9 0 0 0-9-9z" />
                    <path d="M11 40c-2.21 0-4-2.24-4-5a3.71 3.71 0 0 1 4-4 3.71 3.71 0 0 1 4 4c0 2.76-1.79 5-4 5zm0-7c-1.79 0-2 1.14-2 2 0 1.6.93 3 2 3s2-1.4 2-3c0-.86-.21-2-2-2z" />
                    <path d="M18 45h-2v-3.31a1 1 0 0 0-.84-1L11 40l-4.17.7a1 1 0 0 0-.83 1V45H4v-3.31a3 3 0 0 1 2.51-2.95l4.33-.74h.32l4.33.73A3 3 0 0 1 18 41.69z" />
                  </g>
                </g>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 m-4">
              Comunidad
            </h3>
            <p className="text-gray-600 text-sm">
              Participa en foros y discusiones, conectando con otros
              estudiantes.
            </p>
          </div>
        </div>

        {/* Sección inferior con imagen */}
        <div className="bg-gray-100 overflow-hidden rounded-lg mx-auto max-w-4/5 mb-30">
          <div className="md:flex h-75 items-center">
            <div className="md:w-4/7 relative">
              <img
                src={main1}
                alt="Potencia tu preparación"
                className="w-full h-auto object-cover"
              />
              {/* SVG centrado en la imagen */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {/* Reemplaza esto con tu SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 128 128"
                  xml:space="preserve"
                >
                  <path
                    d="m127.634 40.665-22.146 48.792h-84.8L.366 40.665c-1.631-3.691 2.513-7.259 5.937-5.112L28.11 49.225l13.002 26.261h13.659V68L43.242 51.762a4.082 4.082 0 0 1 .168-4.948l17.41-21.307c1.641-2.009 4.718-2.009 6.36 0l17.41 21.308a4.083 4.083 0 0 1 .168 4.948L73.229 68v7.486h13.659L99.89 49.225l21.807-13.672c3.424-2.147 7.567 1.421 5.937 5.112zm-22.146 52.883h-84.8V104h84.801V93.548z"
                  />
                </svg>
              </div>
            </div>
            <div className="md:w-3/7 px-10 py-8 md:py-0">
              <h2 className="text-2xl font-bold text-stone-950 mb-4">
                ¡Potencia tu preparación!
              </h2>
              <p className="text-gray-700">
                Suscríbete y elimina las restricciones de dificultad, obteniendo
                acceso total a todos los Quizzes.
                <br />
                Accede a tutorías personalizadas.
                <br />
                Asesora una pregunta exclusiva en tu portafolio.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
