export const PreguntaModel = {
  name: "Preguntas",
  campos: [
    {
      name: "id_pregunta",
      type: "string",
      disabled: true,
      label: "ID Pregunta",
    },
    { name: "enunciado", type: "string", disabled: false, label: "Enunciado" },
    {
      name: "dificultad",
      type: "select",
      disabled: false,
      label: "Dificultad",
      options: ["Baja", "Media", "Alta", "Muy Alta"],
    },
    {
      name: "opciones",
      type: "object",
      disabled: false,
      label: "Opciones",
      fields: [
        { name: "a", type: "string", disabled: false, label: "Opción A" },
        { name: "b", type: "string", disabled: false, label: "Opción B" },
        { name: "c", type: "string", disabled: false, label: "Opción C" },
        { name: "d", type: "string", disabled: false, label: "Opción D" },
        {
          name: "correcta",
          type: "select",
          disabled: false,
          label: "Opción Correcta",
          options: ["a", "b", "c", "d"],
        },
      ],
    },
    {
      name: "id_subcategoria",
      type: "string",
      disabled: false,
      label: "ID Subcategoría",
    },
    {
      name: "explicacion",
      type: "string",
      disabled: false,
      label: "Explicación",
      optional: true,
    },
  ],
};
