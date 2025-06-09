export const IntentoQuizModel = {
  name: 'Intentos Quiz',
  campos: [
    { name: 'id', type: 'string', disabled: true, label: 'ID Intento' },
    { name: 'uid', type: 'string', disabled: true, label: 'ID Usuario' },
    { name: 'id_quiz', type: 'string', disabled: true, label: 'ID Quiz' },
    { name: 'fecha_inicio', type: 'timestamp', disabled: true, label: 'Fecha Inicio' },
    { name: 'fecha_fin', type: 'timestamp', disabled: true, label: 'Fecha Fin' },
    { 
      name: 'respuestas_usuario', 
      type: 'array', 
      disabled: true,
      fields: {
        id_pregunta: { type: 'string', disabled: false, label: 'ID Pregunta' },
        respuesta_usuario: { type: 'string', disabled: true, label: 'Respuesta Usuario' },
        es_correcta: { type: 'boolean', disabled: true, label: 'Correcta' }
      }
    }
  ]
};