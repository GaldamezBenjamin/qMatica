export const QuizModel = {
  name: 'Quizzes',
  campos: [
    { name: 'id_quiz', type: 'string', disabled: true, label: 'ID Quiz' },
    { name: 'nombre', type: 'string', disabled: false, label: 'Nombre' },
    { name: 'dificultad', type: 'select', disabled: false, label: 'Dificultad', options: ['Baja', 'Media', 'Alta', 'Muy Alta'] },
    { name: 'cantidad_preguntas', type: 'number', disabled: false, label: 'Cantidad de preguntas' },
    { name: 'tiempo_estimado', type: 'number', disabled: false, label: 'Tiempo estimado (mins)' },
    { 
      name: 'id_preguntas', 
      type: 'array', 
      disabled: false,
      fields: {
        id_pregunta: { type: 'string', disabled: false, label: 'ID Pregunta' },
      }
    }
  ]
};