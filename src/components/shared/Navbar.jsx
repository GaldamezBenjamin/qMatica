const Navbar = () => {
  return (
    <header className="bg-white py-4 px-6 flex items-center justify-between border-b-[1px] border-[#ececec]">
      <div className="text-2xl font-black font-merriweather bg-gradient-to-r from-[#f0596c] to-[#824894] text-transparent bg-clip-text">
        qMática
      </div>
      <nav className="space-x-8 flex items-center text-stone-950">
        <a href="#" className="font-medium hover:text-stone-500">
          Quizzes
        </a>
        <a href="#" className="font-medium hover:text-stone-500">
          Temarios
        </a>
        <a href="#" className="font-medium hover:text-stone-500">
          Foros
        </a>
        <div className="flex items-center space-x-4">
          <a
            href="#"
            className="font-medium bg-gradient-to-r from-[#f0596c] to-[#824894] text-transparent bg-clip-text"
          >
            Suscribirse
          </a>
          <span className="font-extralight text-[#ececec] text-3xl">|</span>
          <a href="#" className="font-medium hover:text-stone-500">
            Iniciar Sesión
          </a>
        </div>
        <button className="bg-[#f0596c] text-white font-semibold py-2 px-4 rounded hover:bg-[#ff7184] focus:outline-none">
          Registrarse
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
