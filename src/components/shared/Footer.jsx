const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8 px-6 text-center">
      <div className="mb-5">
        <p className="text-6xl font-black font-merriweather bg-gradient-to-r from-[#f0596c] to-[#824894] text-transparent bg-clip-text">
          qMática
        </p>
      </div>
      <div className="mb-5 text-stone-950 font-semibold text-sm">
        <a href="#" className="hover:text-stone-500 mx-6">
          Condiciones de Uso
        </a>
        <a href="#" className="hover:text-stone-500 mx-6">
          Política de Privacidad
        </a>
        <a href="#" className="hover:text-stone-500 mx-6">
          Sobre Nosotros
        </a>
        <a href="#" className="hover:text-stone-500 mx-6">
          Preguntas Frecuentes
        </a>
      </div>
      <div className="flex justify-center space-x-4 mb-4">
        <a href="#" className="hover:opacity-80">
          <div className="bg-[#f0596c] rounded-md w-10 h-10 flex items-center justify-center text-white text-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
            </svg>
          </div>
        </a>
        <a href="#" className="hover:opacity-80">
          <div className="bg-[#824894] rounded-md w-10 h-10 flex items-center justify-center text-white text-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </div>
        </a>
      </div>
      <div className="text-sm text-gray-500">
        ©qMática 2025
        <br />
        Todos los derechos reservados a los creadores
      </div>
    </footer>
  );
};

export default Footer;
