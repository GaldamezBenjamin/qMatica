import { auth } from "../firebaseClient";

export const apiRequest = async (url, method, data = null, needsContentType = true) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No hay usuario autenticado');

  const token = await user.getIdToken();
  
  const headers = {
    'Authorization': `Bearer ${token}`
  };

  if (needsContentType && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    method,
    headers
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);

  // Manejo especial para 404 - Recurso no encontrado
  if (response.status === 404) {
    return null; // Retornamos null en lugar de lanzar error
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error en la solicitud');
  }

  return response.json();
};

// Métodos CRUD Usuarios:
export const createUser = (data) => apiRequest('/api/usuarios/profile', 'POST', data);
export const createStats = (data) => apiRequest('/api/estadisticas', 'POST', data);
export const createQuizAttempt = (data) => apiRequest('/api/intentosquizzes/start', 'POST', data);

export const getUsers = () => apiRequest('/api/usuarios', 'GET');
export const getUserByID = (userId) => apiRequest(`/api/usuarios/${userId}`, 'GET');
export const getUserStats = (userId) => apiRequest(`/api/estadisticas/${userId}`, 'GET');
export const getUserQuizAttempts = async (userId) => apiRequest(`/api/intentosquizzes/user/${userId}`, 'GET');

export const getUserProfile = (userId) => apiRequest(`/api/usuarios/${userId}/profile/`, 'GET');

export const getAllStats = () => apiRequest('/api/estadisticas', 'GET');
export const getQuizAttemptByID = (attemptId) => apiRequest(`/api/intentosquizzes/${attemptId}`, 'GET');

export const updateUserBase = (userId, data) => apiRequest(`/api/usuarios/${userId}`, 'PUT', data);
export const updateUserSubscription = (userId, data) => apiRequest(`/api/usuarios/${userId}/subscription`, 'PATCH', data);
export const updateUserExperience = (userId, data) => apiRequest(`/api/usuarios/${userId}/experience`, 'PATCH', data);
export const updateUserStats = (userId, data) => apiRequest(`/api/estadisticas/${userId}`, 'PUT', data);
export const updateUserStatsSubcategoria = (userId, data) => apiRequest(`/api/estadisticas/${userId}/subcategories`, 'PATCH', data);
export const updateQuizAttempt = (attemptId, data) => apiRequest(`/api/intentosquizzes/${attemptId}/submit`, 'PUT', data);

export const deleteUser = (userId) => apiRequest(`/api/usuarios/${userId}`, 'DELETE');
export const deleteUserStats = (userId) => apiRequest(`/api/estadisticas/${userId}`, 'DELETE');
export const deleteQuizAttempt = (attemptId) => apiRequest(`/api/intentosquizzes/${attemptId}`, 'DELETE');

export const disableUserAccount = (userId) => apiRequest(`/api/usuarios/${userId}/disable`, 'PATCH');

// Métodos CRUD Categorías: (Categorías y SubCategorías) [TODOS]
export const createCategoria = (data) => apiRequest('/api/categorias', 'POST', data);
export const createSubCategoria = (data) => apiRequest('/api/subcategorias', 'POST', data);

export const getCategorias = () => apiRequest('/api/categorias', 'GET');
export const getCategoriaByID = (categoriaID) => apiRequest(`/api/categorias/${categoriaID}`, 'GET');
export const getSubCategorias = () => apiRequest('/api/subcategorias', 'GET');
export const getSubCategoriaByID = (subCategoriaID) => apiRequest(`/api/subcategorias/${subCategoriaID}`, 'GET');

export const updateCategoria = (categoriaID, data) => apiRequest(`/api/categorias/${categoriaID}`, 'PUT', data);
export const updateSubCategoria = (subCategoriaID, data) => apiRequest(`/api/subcategorias/${subCategoriaID}`, 'PUT', data);

export const deleteCategoria = (categoriaID) => apiRequest(`/api/categorias/${categoriaID}`, 'DELETE');
export const deleteSubCategoria = (subCategoriaID) => apiRequest(`/api/subcategorias/${subCategoriaID}`, 'DELETE');


// Métodos CRUD Quizzes: (Quizzes y Preguntas) [TODOS]
export const createQuiz = (data) => apiRequest('/api/quizzes', 'POST', data);
export const createPregunta = (data) => apiRequest('/api/preguntas', 'POST', data);

export const getQuizzes = () => apiRequest('/api/quizzes', 'GET');
export const getQuizByID = (quizID) => apiRequest(`/api/quizzes/${quizID}`, 'GET');
export const getQuizPreguntas = (quizID) => apiRequest(`/api/quizzes/${quizID}/questions`, 'GET');
export const getPreguntas = () => apiRequest('/api/preguntas', 'GET');
export const getPreguntaByID = (preguntaID) => apiRequest(`/api/preguntas/${preguntaID}`, 'GET');
export const getPreguntasBySubcategoria = (subCategoriaID) => apiRequest(`/api/preguntas/subcategory/${subCategoriaID}`, 'GET');

export const updateQuiz = (quizID, data) => apiRequest(`/api/quizzes/${quizID}`, 'PUT', data);
export const updatePregunta = (preguntaID, data) => apiRequest(`/api/preguntas/${preguntaID}`, 'PUT', data);

export const deleteQuiz = (quizID) => apiRequest(`/api/quizzes/${quizID}`, 'DELETE');
export const deletePregunta = (preguntaID) => apiRequest(`/api/preguntas/${preguntaID}`, 'DELETE');


// Métodos CRUD Foros: (Foros y Mensajes Foros) [TODOS]
export const createForo = (data) => apiRequest('/api/foros', 'POST', data);
export const createMensajeForo = (data) => apiRequest('/api/mensajesforos', 'POST', data);

export const getForos = () => apiRequest('/api/foros', 'GET');
export const getForoByID = (foroID) => apiRequest(`/api/foros/${foroID}`, 'GET');
export const getMensajesFromForo = (foroID) => apiRequest(`/api/mensajesforos/forum/${foroID}`, 'GET');
export const getMensajeByID = (mensajeID) => apiRequest(`/api/mensajesforos/${mensajeID}`, 'GET');

export const updateForo = (foroID, data) => apiRequest(`/api/foros/${foroID}`, 'PUT', data);
export const updateMensajeForo = (mensajeID, data) => apiRequest(`/api/mensajesforos/${mensajeID}`, 'PUT', data);

export const deleteForo = (foroID) => apiRequest(`/api/foros/${foroID}`, 'DELETE');
export const deleteMensajeForo = (mensajeID) => apiRequest(`/api/mensajesforos/${mensajeID}`, 'DELETE');

// Métodos EXP y Rangos:
export const getEXP = () => apiRequest('/api/exp', 'GET');
export const getRangos = () => apiRequest('/api/exp/rangos', 'GET');
export const getDifEXP = () => apiRequest('/api/exp/dificultad', 'GET');