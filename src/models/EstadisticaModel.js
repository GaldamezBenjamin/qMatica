export const EstadisticaModel = {
  name: 'Estadisticas',
  campos: [
    { name: 'uid', type: 'string', disabled: true, label: 'ID Usuario' },
    { name: 'quizzes_completados', type: 'number', disabled: true, label: 'Quizzes completados' },
    { name: 'tiempo_promedio', type: 'number', disabled: true, label: 'Tiempo promedio (seg)' },
    { 
      name: 'respuestas_por_categoria', 
      type: 'array', 
      disabled: true,
      fields: {
        id_subcategoria: { type: 'string', disabled: false, label: 'ID Subcategoría' },
        correctas: { type: 'number', disabled: true, label: 'Respuestas correctas' },
        incorrectas: { type: 'number', disabled: true, label: 'Respuestas incorrectas' }
      }
    }
  ]
};