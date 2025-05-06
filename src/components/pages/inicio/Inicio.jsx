import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";

const InicioPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Aquí irá el contenido principal de tu página */}
        {/* Como ahora solo tienes el header y el footer, este <main> estará vacío o contendrá poco contenido */}
      </main>
      <Footer />
    </div>
  );
};

export default InicioPage;
