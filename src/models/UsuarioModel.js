export const UsuarioModel = {
  name: 'Usuario', // Opcional: para usar en títulos
  campos: [
    { name: 'id', type: 'string', disabled: true, label: 'ID' },
    { name: 'username', type: 'string', disabled: false, label: 'Nombre de usuario' },
    { name: 'email', type: 'email', disabled: false, label: 'Correo electrónico' },
    { name: 'fecha_registro', type: 'timestamp', disabled: true, label: 'Fecha de registro' },
    { name: 'rol', type: 'select', disabled: false, label: 'Rol', options: ['usuario', 'admin'] },
    {
      name: 'exp',
      type: 'object',
      disabled: false, // El disabled aquí aplica al grupo completo, no a los sub-campos
      label: 'Experiencia', // Etiqueta para el fieldset del objeto
      fields: [
        { name: 'actual', type: 'number', disabled: false, label: 'EXP actual' },
        { name: 'anterior', type: 'number', disabled: false, label: 'EXP anterior' }
      ]
    },
    {
      name: 'suscripcion',
      type: 'object',
      disabled: false, // El disabled aquí aplica al grupo completo
      label: 'Suscripción', // Etiqueta para el fieldset del objeto
      fields: [
        { name: 'suscrito', type: 'boolean', disabled: false, label: 'Suscrito' },
        { name: 'fecha_inicio', type: 'timestamp', disabled: true, label: 'Fecha inicio' },
        { name: 'fecha_fin', type: 'timestamp', disabled: true, label: 'Fecha fin' }
      ]
    }
  ]
};