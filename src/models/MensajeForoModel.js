export const MensajeForoModel = {
  name: "Mensaje de Foros",
  campos: [
    {
      name: "id_mensaje",
      type: "string",
      disabled: true,
      label: "ID Mensaje",
    },
    { 
      name: "contenido",
      type: "string",
      disabled: false,
      label: "Mensaje"
    },
    { 
      name: "fecha_creacion",
      type: "timestamp",
      disabled: true,
      label: "Fecha de creación"
    },
    { 
      name: "autor_uid",
      type: "string",
      disabled: true,
      label: "Autor"
    },
    {
      name: "id_foro",
      type: "string",
      disabled: true,
      label: "ID Foro",
    },
  ],
};
