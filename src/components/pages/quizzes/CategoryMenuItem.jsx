import React from "react";

const CategoryMenuItem = ({
  category,
  currentSelectedSubcategories,
  onCheckboxChange,
}) => {
  return (
    <li className="py-1">
      <details>
        <summary className="text-sm font-medium">{category.nombre}</summary>
        {category.subcategories.length > 0 ? (
          category.subcategories.map((subCat) => (
            <li key={subCat.id_subcategoria}>
              <label className="label cursor-pointer items-start">
                {" "}
                {/* items-start para texto multilinea */}
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs rounded-xs border-0 bg-neutral-300 checked:checkbox-primary mr-1 mt-[0.2rem]"
                  checked={currentSelectedSubcategories.has(
                    subCat.id_subcategoria
                  )}
                  onChange={(e) =>
                    onCheckboxChange(subCat.id_subcategoria, e.target.checked)
                  }
                />
                <span
                  className={`label-text text-sm flex-grow text-left whitespace-normal break-words ${
                    currentSelectedSubcategories.has(subCat.id_subcategoria)
                      ? "text-primary"
                      : ""
                  }`}
                >
                  {subCat.nombre}
                </span>
              </label>
            </li>
          ))
        ) : (
          <li>
            <a className="text-gray-500">No hay subcategorías disponibles.</a>
          </li>
        )}
      </details>
    </li>
  );
};

export default CategoryMenuItem;
