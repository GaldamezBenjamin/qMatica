import React from 'react';
import { Routes, Route } from 'react-router';
import Navbar from './components/shared/Navbar.jsx';
import RouteGuard from './components/auth/RouteGuard.jsx';

import InicioPage from './components/pages/inicio/Inicio.jsx';
import QuizzesMenu from './components/pages/quizzes/QuizzesMenu.jsx';
import Quiz from './components/pages/quizzes/Quiz.jsx';
import QuizResultsPage from './components/pages/quizzes/QuizResultsPage.jsx';
import ForosMenu from './components/pages/foros/ForosMenu.jsx';
import Foro from './components/pages/foros/Foro.jsx';
import User from './components/pages/user/UserProfile.jsx';
import AdminPanel from './components/pages/controlPanel/AdminPanel.jsx';
import SubscPage from './components/pages/subscription/Subscription.jsx';
import NotFound from './components/pages/notFound/NotFound.jsx';
import PaypalSuccess from './components/pages/subscription/PaypalSuccess.jsx';
import PaypalCancel from './components/pages/subscription/PaypalCancel.jsx';
import CreadorQuizzes from './components/pages/quizzes/CreadorQuizzes.jsx';

import { ToastContainer, toast } from 'react-toastify';


function App() {
  return (
    <>
      <Navbar />
      <div className="pt-16">
        <Routes>
          {/* Ruta pública */}
          <Route path="/" element={<InicioPage />} />
          
          {/* Ruta de suscripción (accesible solo para autenticados) */}
          <Route 
            path="/subscripcion" 
            element={
              <RouteGuard requireAuth>
                <SubscPage />
              </RouteGuard>
            } 
          />

          {/* Ruta de suscripción (accesible solo para autenticados) */}
          <Route 
            path="/paypal-success" 
            element={
              <RouteGuard requireAuth>
                <PaypalSuccess />
              </RouteGuard>
            } 
          />

          {/* Ruta de suscripción (accesible solo para autenticados) */}
          <Route 
            path="/paypal-cancel" 
            element={
              <RouteGuard requireAuth>
                <PaypalCancel />
              </RouteGuard>
            } 
          />
          
          {/* Ruta de quizzes (accesible solo para usuarios autenticados) */}
          <Route 
            path="/quizzes" 
            element={
              <RouteGuard requireAuth>
                <QuizzesMenu />
              </RouteGuard>
            } 
          />

          {/* Ruta de quizzes (accesible solo para usuarios autenticados) */}
          <Route 
            path="/quizzes/creador" 
            element={
              <RouteGuard requireAuth requireSubscription>
                <CreadorQuizzes />
              </RouteGuard>
            } 
          />

          {/* Ruta de quiz (accesible solo para usuarios autenticados) */}
          <Route 
            path="/quiz" 
            element={
              <RouteGuard requireAuth>
                <Quiz />
              </RouteGuard>
            } 
          />

          {/* Ruta de resultados de quiz (accesible solo para usuarios autenticados) */}
          <Route 
            path="/quiz/results" 
            element={
              <RouteGuard requireAuth>
                <QuizResultsPage />
              </RouteGuard>
            } 
          />
          
          {/* Ruta de foros (accesible solo para usuarios autenticados) */}
          <Route 
            path="/foros" 
            element={
              <RouteGuard requireAuth>
                <ForosMenu />
              </RouteGuard>
            } 
          />

          {/* Ruta de foro (accesible solo para usuarios autenticados) */}
          <Route 
            path="/foros/foro/:id_foro" 
            element={
              <RouteGuard requireAuth>
                <Foro />
              </RouteGuard>
            } 
          />
          
          {/* Ruta de perfil de usuario (accesible solo para autenticados) */}
          <Route 
            path="/user" 
            element={
              <RouteGuard requireAuth>
                <User />
              </RouteGuard>
            } 
          />
          
          {/* Ruta de administración (solo para admins) */}
          <Route 
            path="/admin" 
            element={
              <RouteGuard requireAuth requireAdmin>
                <AdminPanel />
              </RouteGuard>
            } 
          />
          
          {/* Ruta para páginas no encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;