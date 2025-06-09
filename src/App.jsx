import React from 'react';
import { Routes, Route } from 'react-router';
import Navbar from './components/shared/Navbar.jsx';

import InicioPage from './components/pages/inicio/Inicio.jsx';
import QuizzesList from './components/pages/quizzes/QuizzesList.jsx';
import ForosList from './components/pages/foros/ForosList.jsx';
import User from './components/pages/user/User.jsx';
import AdminPanel from './components/pages/controlPanel/AdminPanel.jsx';
import SubscPage from './components/pages/subscription/Subscription.jsx';

function App() {
  return (
    <>
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<InicioPage />}/>
          <Route path='/subscripcion' element={<SubscPage/>}/>
          <Route path="/quizzes" element={<QuizzesList/>}/>
          <Route path="/foros" element={<ForosList/>}/>
          <Route path="/user" element={<User/>}/>
          <Route path='/admin' element={<AdminPanel/>}/>
        </Routes>
      </div>
    </>
  );
}

export default App;