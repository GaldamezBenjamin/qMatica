import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseClient';

const ForgotPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (!email) {
      setError('Por favor, ingresa tu correo electrónico.');
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Se ha enviado un correo de recuperación a tu dirección. Por favor, revisa tu bandeja de entrada (y la carpeta de spam).');
      setEmail(''); // Limpia el campo de correo
    } catch (firebaseError) {
      console.error('Error al enviar correo de recuperación:', firebaseError.code, firebaseError.message);
      switch (firebaseError.code) {
        case 'auth/invalid-email':
          setError('El formato del correo electrónico es inválido.');
          break;
        case 'auth/user-not-found':
          // Por seguridad, no debemos indicar si el correo existe o no.
          // El mensaje genérico es preferible.
          setError('Si tu correo está registrado, recibirás un enlace de recuperación. Revisa tu bandeja de entrada.');
          break;
        case 'auth/missing-email':
          setError('Por favor, ingresa un correo electrónico.');
          break;
        case 'auth/too-many-requests':
          setError('Demasiados intentos. Por favor, espera un momento e inténtalo de nuevo.');
          break;
        default:
          setError('Error al intentar recuperar la contraseña. Inténtalo de nuevo más tarde.');
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="card bg-base-200 shadow-sm w-[400px] p-6 text-center">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
          disabled={loading}
        >
          ✕
        </button>
        <h2 className="card-title justify-center mb-4">¿Olvidaste tu Contraseña?</h2>

        {message && (
          <div role="alert" className="alert alert-success alert-soft mb-4">
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div role="alert" className="alert alert-error alert-soft mb-4">
            <span>{error}</span>
          </div>
        )}

        <p className="mb-4 text-sm">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <form onSubmit={handleSubmit}>
          <fieldset className="fieldset mb-4">
            <label className="fieldset-legend">Correo</label>
            <input
              type="email"
              className="input w-full"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </fieldset>
          <div className="card-actions justify-center">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Restablecer Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;