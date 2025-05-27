import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import InicioPage from './components/pages/inicio/Inicio.jsx';
import QuizzesList from './components/pages/quizzes/QuizzesList.jsx';
import ForosList from './components/pages/foros/ForosList.jsx';
import User from './components/pages/user/User.jsx';
import AdminPanel from './components/pages/controlPanel/AdminPanel.jsx';

import InicioSt from './components/pages/static/InicioSt.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InicioPage />} />
        <Route path="/quizzes" element={<QuizzesList />} />
        <Route path="/foros" element={<ForosList />} />
        <Route path="/user" element={<User />} />
        <Route path='/admin' element={<AdminPanel />} />

        <Route path="/static" element={<InicioSt />} />
        <Route path="/static/inicio" element={<InicioSt />} />
      </Routes>
    </Router>
  );
}

export default App;