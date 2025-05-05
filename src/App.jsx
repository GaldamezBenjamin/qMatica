import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import InicioPage from './components/inicio/Inicio.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* La ruta base '/' renderizará el componente Inicio */}
        <Route path="/" element={<InicioPage />} />

        {/* También puedes tener una ruta explícita para '/inicio' si lo deseas */}
        {/* <Route path="/inicio" element={<Inicio />} /> */}

        {/* <Route path="/productos" element={<Productos />} /> */}
      </Routes>
    </Router>
  );
}

export default App;