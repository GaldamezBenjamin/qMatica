export const EstadisticaModel = {
  name: 'Estadisticas',
  campos: [
    { name: 'uid', type: 'string', disabled: true, label: 'ID Usuario' },
    { name: 'ultima_actualizacion', type: 'timestamp', disabled: true, label: 'Última actualización' },
    { name: 'quizzes_completados', type: 'number', disabled: true, label: 'Quizzes completados' },
    { name: 'tiempo_promedio', type: 'number', disabled: true, label: 'Tiempo promedio (seg)' },
    { name: 'total_tiempo', type: 'number', disabled: true, label: 'Tiempo total (seg)' },
    { 
      name: 'respuestas_por_categoria', 
      type: 'array_map', 
      disabled: true,
      fields: {
        id_subcategoria: { type: 'string', disabled: true, label: 'ID Subcategoría' },
        correctas: { type: 'number', disabled: true, label: 'Respuestas correctas' },
        incorrectas: { type: 'number', disabled: true, label: 'Respuestas incorrectas' }
      }
    }
  ]
};