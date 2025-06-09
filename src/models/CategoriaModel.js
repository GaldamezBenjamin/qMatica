export const CategoriaModel = {
  name: "Categorías",
  campos: [
    {
      name: "id_categoria",
      type: "string",
      disabled: true,
      label: "ID Categoría",
    },
    { 
      name: "nombre",
      type: "string",
      disabled: false,
      label: "Nombre"
    },
    {
      name: "paes",
      type: "select",
      label: "PAES",
      options: ["M1", "M2"],
      disabled: false,
    },
  ],
};
