import React from "react";
import Footer from "../../shared/Footer";
import mainPhoto1 from "../../../assets/images/main1.png";
import mainPhoto3 from "../../../assets/images/main3.png";
import {
  BrainCircuit,
  Medal,
  ChartNoAxesCombined,
  UsersRound,
  CircleSmall,
  Crown
} from "lucide-react";

const InicioPage = () => {
  return (
    <>
      <MainSection />
      <Footer />
    </>
  );
};

export default InicioPage;

function MainSection() {
  return (
    <main className="bg-white">
      <div className="relative overflow-hidden">
        <PanelSec />
      </div>

      <div className="my-25 lg:hidden">
        <InfoTimelineSec />
      </div>

      <div className="my-25 lg:block hidden">
        <InfoCardsSec />
      </div>

      <div className="my-25">
        <div className="xl:max-w-[90%] mx-auto">
          <SubsCardSec />
        </div>
      </div>
    </main>
  );
}

const PanelSec = () => {
  return (
    <div
      className="hero h-[600px]"
      style={{
        backgroundImage: `url(${mainPhoto3})`,
      }}
    >
      <div className="hero-overlay bg-transparent"></div>
      <div className="hero-content text-base-100 text-center">
        <div className="max-w-xl">
          <h1 className="mb-5 text-6xl font-bold">
            ¡Prepárate para la PAES con Quizzes Inteligentes!
          </h1>
          <p className="mb-5 text-lg">
            Domina cada tema con quizzes personalizados y predefinidos,
            diseñados para adaptarse a tu nivel y necesidades.
          </p>
        </div>
      </div>
    </div>
  );
};

const InfoCardsSec = () => {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {/* Card 1 */}
      <div className="card bg-base-300 text-neutral-content max-w-80 min-w-70 w-full md:w-[calc(50%-1.5rem/2)] lg:w-[calc(50%-1.5rem/2)] flex-grow">
        <figure className="px-10 pt-10">
          <BrainCircuit size={60} color="#0f0f0f" strokeWidth={1.5} />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title">Quizzes con IA</h2>
          <p>
            Adaptados al temario PAES y personalizados según tus debilidades.
          </p>
        </div>
      </div>

      {/* Card 2 */}
      <div className="card bg-base-300 text-neutral-content max-w-80 min-w-70 w-full md:w-[calc(50%-1.5rem/2)] lg:w-[calc(50%-1.5rem/2)] flex-grow">
        <figure className="px-10 pt-10">
          <Medal size={60} color="#0f0f0f" strokeWidth={1.5} />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title">Sistema de Rangos</h2>
          <p>
            Gana experiencia, sube de nivel y desbloquea quizzes según tu nivel.
          </p>
        </div>
      </div>

      {/* Card 3 */}
      <div className="card bg-base-300 text-neutral-content max-w-80 min-w-70 w-full md:w-[calc(50%-1.5rem/2)] lg:w-[calc(50%-1.5rem/2)] flex-grow">
        <figure className="px-10 pt-10">
          <ChartNoAxesCombined size={60} color="#0f0f0f" strokeWidth={1.5} />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title">Estadísticas de Usuario</h2>
          <p>
            Ve tus estadísticas detalladas de tu progreso e identifica tus
            debilitades por categorías.
          </p>
        </div>
      </div>

      {/* Card 4 */}
      <div className="card bg-base-300 text-neutral-content max-w-80 min-w-70 w-full md:w-[calc(50%-1.5rem/2)] lg:w-[calc(50%-1.5rem/2)] flex-grow">
        <figure className="px-10 pt-10">
          <UsersRound size={60} color="#0f0f0f" strokeWidth={1.5} />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title">Comunidad</h2>
          <p>
            Participa en foros y discusiones, conectando con otros estudiantes.
          </p>
        </div>
      </div>
    </div>
  );
};

const InfoTimelineSec = () => {
  return (
    <ul className="timeline timeline-vertical mx-10">
      <li>
        <div className="timeline-middle">
          <CircleSmall size={32} color="#f0596c" strokeWidth={2.5} />
        </div>
        <div className="timeline-start">
          <div className="card bg-base-300 text-neutral-content max-w-100 min-w-50">
            <figure className="px-10 pt-10">
              <BrainCircuit size={60} color="#0f0f0f" strokeWidth={1.5} />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">Quizzes con IA</h2>
              <p>
                Adaptados al temario PAES y personalizados según tus
                debilidades.
              </p>
            </div>
          </div>
        </div>
        <hr className="bg-primary"/>
      </li>
      <li>
        <hr className="bg-primary"/>
        <div className="timeline-middle">
          <CircleSmall size={32} color="#f0596c" strokeWidth={2.5} />
        </div>
        <div className="timeline-end">
          <div className="card bg-base-300 text-neutral-content max-w-100 min-w-50">
            <figure className="px-10 pt-10">
              <Medal size={60} color="#0f0f0f" strokeWidth={1.5} />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">Sistema de Rangos</h2>
              <p>
                Gana experiencia, sube de nivel y desbloquea quizzes según tu
                nivel.
              </p>
            </div>
          </div>
        </div>
        <hr className="bg-primary"/>
      </li>
      <li>
        <hr className="bg-primary"/>
        <div className="timeline-middle">
          <CircleSmall size={32} color="#f0596c" strokeWidth={2.5} />
        </div>
        <div className="timeline-start">
          <div className="card bg-base-300 text-neutral-content max-w-100 min-w-50">
            <figure className="px-10 pt-10">
              <ChartNoAxesCombined
                size={60}
                color="#0f0f0f"
                strokeWidth={1.5}
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">Estadísticas de Usuario</h2>
              <p>
                Ve tus estadísticas detalladas de tu progreso e identifica tus
                debilidades por categorías.
              </p>
            </div>
          </div>
        </div>
        <hr className="bg-primary"/>
      </li>
      <li>
        <hr className="bg-primary"/>
        <div className="timeline-middle">
          <CircleSmall size={32} color="#f0596c" strokeWidth={2.5} />
        </div>
        <div className="timeline-end">
          <div className="card bg-base-300 text-neutral-content max-w-100 min-w-50">
            <figure className="px-10 pt-10">
              <UsersRound size={60} color="#0f0f0f" strokeWidth={1.5} />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">Comunidad</h2>
              <p>
                Participa en foros y discusiones, conectando con otros
                estudiantes.
              </p>
            </div>
          </div>
        </div>
      </li>
    </ul>
  );
};

const SubsCardSec = () => {
  return (
    <div className="card lg:card-side bg-base-300 shadow-sm lg:mx-30 mx-10">
      {/* Contenedor de la imagen y el icono */}
      {/* Añadimos 'relative' para que el posicionamiento absoluto del icono sea relativo a este figure */}
      <figure className="lg:w-[65%] relative">
        <img src={mainPhoto1} className="lg:max-h-[400px] max-h-auto w-full object-cover" />
        
        <Crown 
          size={120} 
          color="#ffffff" 
          strokeWidth={1.5} 
          className="absolute lg:max-h-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
        />
      </figure>

      <div className="card-body">
        <h2 className="card-title text-2xl font-bold">¡Potencia tu preparación!</h2>
        <p className="text-lg mb-5">
          Suscríbete y elimina las restricciones de dificultad, obteniendo acceso total a todos los Quizzes.
          <br />
          Accede a tutorías personalizadas.
          <br />
          Asesora una pregunta exclusiva en tu portafolio.
        </p>
        <div className="card-actions justify-center">
          <a href="subscripcion" className="btn btn-primary min-w-[90%]">Suscríbete</a>
        </div>
      </div>
    </div>
  );
};
