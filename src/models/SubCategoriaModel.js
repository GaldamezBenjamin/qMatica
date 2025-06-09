export const SubCategoriaModel = {
  name: 'Sub Categorias',
  campos: [
    { name: 'id_subcategoria', type: 'string', disabled: true, label: 'ID Subcategoría' },
    { name: 'nombre', type: 'string', disabled: false, label: 'Nombre' },
    { name: 'id_categoria', type: 'string', disabled: false, label: 'ID Categoría' }
  ]
};