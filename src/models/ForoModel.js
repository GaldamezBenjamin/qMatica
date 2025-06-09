export const ForoModel = {
  name: "Foros",
  campos: [
    {
      name: "id_foro",
      type: "string",
      disabled: true,
      label: "ID Foro",
    },
    { 
      name: "titulo",
      type: "string",
      disabled: false,
      label: "Título"
    },
    { 
      name: "descripcion",
      type: "string",
      disabled: false,
      label: "Descripción"
    },
    { 
      name: "fecha_creacion",
      type: "timestamp",
      disabled: true,
      label: "Fecha de creación"
    },
    { 
      name: "creador_uid",
      type: "string",
      disabled: true,
      label: "Autor"
    }
  ],
};
