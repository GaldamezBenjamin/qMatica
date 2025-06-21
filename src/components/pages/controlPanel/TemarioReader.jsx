import React, { useRef, useState } from "react";
import { Upload, FileText, BookText, Check, ChevronDown, Loader2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { auth } from "../../../firebaseClient";
import { uploadTemarioPdf, bulkUploadCategorias } from "../../../helpers/apiHelpers";

export const TemarioReader = () => {
  // Estados para M1
  const [selectedFileM1, setSelectedFileM1] = useState(null);
  const [uploadStatusM1, setUploadStatusM1] = useState("");
  const [extractedDataM1, setExtractedDataM1] = useState(null);
  const [errorM1, setErrorM1] = useState("");
  const [firebaseUploadStatusM1, setFirebaseUploadStatusM1] = useState("");

  // Estados para M2
  const [selectedFileM2, setSelectedFileM2] = useState(null);
  const [uploadStatusM2, setUploadStatusM2] = useState("");
  const [extractedDataM2, setExtractedDataM2] = useState(null);
  const [errorM2, setErrorM2] = useState("");
  const [firebaseUploadStatusM2, setFirebaseUploadStatusM2] = useState("");

  const { currentUser } = useAuth();

  // --- Funciones para M1 ---
  const handleFileChangeM1 = (event) => {
    setSelectedFileM1(event.target.files[0]);
    setUploadStatusM1("");
    setExtractedDataM1(null);
    setErrorM1("");
  };

  const handleUploadM1 = async () => {
    if (!selectedFileM1) {
      setErrorM1("Por favor, selecciona un archivo PDF primero.");
      return;
    }
    setUploadStatusM1("Subiendo y procesando...");
    setErrorM1("");
    try {
      // Usa el helper para subir el PDF
      const response = await uploadTemarioPdf(selectedFileM1);
      setUploadStatusM1("Procesado con éxito!");
      const rawDataFromAI = response.data;
      const groupedData = {};
      let categoryCounter = 0;
      let subCategoryCounter = 0;
      rawDataFromAI.forEach((item) => {
        // Capitaliza al generar el JSON
        const categoryName = capitalizeFirst((item.categoria || "").trim());
        const subCategoryName = capitalizeFirst((item.sub_categoria || "").trim());
        const description = (item.descripcion || "").trim();
        if (!categoryName) return;
        if (!groupedData[categoryName]) {
          groupedData[categoryName] = {
            nombre: categoryName,
            paes: "M1",
            id: `cat_m1_${categoryCounter++}`,
            isSelected: true,
            subcategorias: [],
          };
        }
        if (subCategoryName) {
          const subCatExists = groupedData[categoryName].subcategorias.some(
            (sub) => sub.nombre === subCategoryName
          );
          if (!subCatExists) {
            groupedData[categoryName].subcategorias.push({
              nombre: subCategoryName,
              descripcion: description,
              id: `sub_m1_${subCategoryCounter++}`,
              isSelected: true,
            });
          }
        }
      });
      setExtractedDataM1(Object.values(groupedData));
    } catch (err) {
      setUploadStatusM1("Error en el procesamiento.");
      setErrorM1(
        err.message ||
          "Ocurrió un error inesperado al procesar el PDF."
      );
    }
  };

  // Cambia la lógica para que al seleccionar una categoría, seleccione todas sus subcategorías
  const handleCategoryCheckboxChangeM1 = (categoryId) => {
    setExtractedDataM1((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          const newSelected = !cat.isSelected;
          return {
            ...cat,
            isSelected: newSelected,
            subcategorias: cat.subcategorias.map((sub) => ({
              ...sub,
              isSelected: newSelected, // Selecciona/deselecciona todas las subcategorías
            })),
          };
        }
        return cat;
      })
    );
  };

  const handleSubCategoryCheckboxChangeM1 = (categoryId, subCategoryId) => {
    setExtractedDataM1((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              subcategorias: cat.subcategorias.map((sub) =>
                sub.id === subCategoryId
                  ? { ...sub, isSelected: !sub.isSelected }
                  : sub
              ),
            }
          : cat
      )
    );
  };

  const handleBulkUploadToFirebaseM1 = async () => {
    const dataToSend = [];
    extractedDataM1.forEach((categoryGroup) => {
      if (categoryGroup.isSelected && categoryGroup.paes) {
        const selectedSubcategories = categoryGroup.subcategorias
          .filter((subcat) => subcat.isSelected)
          .map((subcat) => ({ nombre: subcat.nombre }));
        if (selectedSubcategories.length > 0) {
          dataToSend.push({
            nombre: categoryGroup.nombre,
            paes: categoryGroup.paes,
            subcategorias: selectedSubcategories,
          });
        }
      }
    });
    if (dataToSend.length === 0) {
      alert(
        "No hay categorías válidas (seleccionadas y con PAES) con subcategorías seleccionadas para subir."
      );
      return;
    }
    setFirebaseUploadStatusM1("Subiendo datos seleccionados a Firebase...");
    setErrorM1("");
    try {
      // Usa el helper para el bulk upload
      await bulkUploadCategorias(dataToSend);
      setFirebaseUploadStatusM1("¡Datos subidos exitosamente a Firebase!");
    } catch (err) {
      setFirebaseUploadStatusM1("Error al subir datos a Firebase.");
      setErrorM1(
        err.message ||
          "Ocurrió un error inesperado al subir los datos a Firebase."
      );
    }
  };

  // --- Funciones para M2 ---
  const handleFileChangeM2 = (event) => {
    setSelectedFileM2(event.target.files[0]);
    setUploadStatusM2("");
    setExtractedDataM2(null);
    setErrorM2("");
  };

  const handleUploadM2 = async () => {
    if (!selectedFileM2) {
      setErrorM2("Por favor, selecciona un archivo PDF primero.");
      return;
    }
    setUploadStatusM2("Subiendo y procesando...");
    setErrorM2("");
    try {
      // Usa el helper para subir el PDF, pasando "temario_m2"
      const response = await uploadTemarioPdf(selectedFileM2, "temario_m2");
      setUploadStatusM2("Procesado con éxito!");
      const rawDataFromAI = response.data;
      const groupedData = {};
      let categoryCounter = 0;
      let subCategoryCounter = 0;
      rawDataFromAI.forEach((item) => {
        // Capitaliza al generar el JSON
        const categoryName = capitalizeFirst((item.categoria || "").trim());
        const subCategoryName = capitalizeFirst((item.sub_categoria || "").trim());
        const description = (item.descripcion || "").trim();
        if (!categoryName) return;
        if (!groupedData[categoryName]) {
          groupedData[categoryName] = {
            nombre: categoryName,
            paes: "M2",
            id: `cat_m2_${categoryCounter++}`,
            isSelected: true,
            subcategorias: [],
          };
        }
        if (subCategoryName) {
          const subCatExists = groupedData[categoryName].subcategorias.some(
            (sub) => sub.nombre === subCategoryName
          );
          if (!subCatExists) {
            groupedData[categoryName].subcategorias.push({
              nombre: subCategoryName,
              descripcion: description,
              id: `sub_m2_${subCategoryCounter++}`,
              isSelected: true,
            });
          }
        }
      });
      setExtractedDataM2(Object.values(groupedData));
    } catch (err) {
      setUploadStatusM2("Error en el procesamiento.");
      setErrorM2(
        err.message ||
          "Ocurrió un error inesperado al procesar el PDF."
      );
    }
  };

  const handleCategoryCheckboxChangeM2 = (categoryId) => {
    setExtractedDataM2((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          const newSelected = !cat.isSelected;
          return {
            ...cat,
            isSelected: newSelected,
            subcategorias: cat.subcategorias.map((sub) => ({
              ...sub,
              isSelected: newSelected,
            })),
          };
        }
        return cat;
      })
    );
  };

  const handleSubCategoryCheckboxChangeM2 = (categoryId, subCategoryId) => {
    setExtractedDataM2((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              subcategorias: cat.subcategorias.map((sub) =>
                sub.id === subCategoryId
                  ? { ...sub, isSelected: !sub.isSelected }
                  : sub
              ),
            }
          : cat
      )
    );
  };

  const handleBulkUploadToFirebaseM2 = async () => {
    const dataToSend = [];
    extractedDataM2.forEach((categoryGroup) => {
      if (categoryGroup.isSelected && categoryGroup.paes) {
        const selectedSubcategories = categoryGroup.subcategorias
          .filter((subcat) => subcat.isSelected)
          .map((subcat) => ({ nombre: subcat.nombre }));
        if (selectedSubcategories.length > 0) {
          dataToSend.push({
            nombre: categoryGroup.nombre,
            paes: categoryGroup.paes,
            subcategorias: selectedSubcategories,
          });
        }
      }
    });
    if (dataToSend.length === 0) {
      alert(
        "No hay categorías válidas (seleccionadas y con PAES) con subcategorías seleccionadas para subir."
      );
      return;
    }
    setFirebaseUploadStatusM2("Subiendo datos seleccionados a Firebase...");
    setErrorM2("");
    try {
      await bulkUploadCategorias(dataToSend);
      setFirebaseUploadStatusM2("¡Datos subidos exitosamente a Firebase!");
    } catch (err) {
      setFirebaseUploadStatusM2("Error al subir datos a Firebase.");
      setErrorM2(
        err.message ||
          "Ocurrió un error inesperado al subir los datos a Firebase."
      );
    }
  };

  // Utilidad para capitalizar sólo la primera letra
  function capitalizeFirst(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-200 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="p-3 rounded-lg bg-primary bg-opacity-10">
          <BookText className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Temarios PAES</h1>
          <p className="text-gray-600">Sube y procesa los temarios oficiales para extraer categorías y subcategorías</p>
        </div>
      </div>

      {/* Sección M1 */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Temario M1</h2>
        </div>

        {/* Upload Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-end">
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar archivo PDF</label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChangeM1}
                className="file-input file-input-bordered w-full"
              />
            </div>
            <button
              onClick={handleUploadM1}
              disabled={!selectedFileM1 || uploadStatusM1.includes("Subiendo")}
              className={`btn w-full sm:w-auto mt-2 sm:mt-0 ${!selectedFileM1 ? 'btn-disabled' : 'btn-primary'}`}
              style={{ minHeight: "42px" }}
            >
              {uploadStatusM1 === "Subiendo y procesando..." ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              Procesar PDF
            </button>
          </div>
          {/* Status Messages */}
          {uploadStatusM1 && (
            <div className={`mt-3 p-3 rounded-lg ${
              uploadStatusM1.includes("éxito") ? 'bg-green-50 text-green-700' : 
              uploadStatusM1.includes("Subiendo") ? 'bg-blue-50 text-blue-700' : 
              'bg-red-50 text-red-700'
            }`}>
              {uploadStatusM1}
            </div>
          )}
          {errorM1 && (
            <div className="mt-3 p-3 rounded-lg bg-red-50 text-red-700">
              {errorM1}
            </div>
          )}
        </div>

        {/* Extracted Data Section */}
        {extractedDataM1 && extractedDataM1.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h3 className="font-semibold text-gray-800">
                Categorías extraídas ({extractedDataM1.filter(c => c.isSelected).length} seleccionadas)
              </h3>
              <button
                onClick={handleBulkUploadToFirebaseM1}
                disabled={firebaseUploadStatusM1.includes("Subiendo")}
                className="btn btn-primary btn-sm w-full sm:w-auto"
              >
                {firebaseUploadStatusM1.includes("Subiendo") ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Subir a Firebase
              </button>
            </div>

            {firebaseUploadStatusM1 && (
              <div className={`p-3 ${
                firebaseUploadStatusM1.includes("éxito") ? 'bg-green-50 text-green-700' : 
                firebaseUploadStatusM1.includes("Subiendo") ? 'bg-blue-50 text-blue-700' : 
                'bg-red-50 text-red-700'
              }`}>
                {firebaseUploadStatusM1}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
              {/* Categories List */}
              <div className="space-y-2">
                {extractedDataM1.map((categoryGroup) => (
                  <div
                    key={categoryGroup.id}
                    className="collapse border border-gray-200 rounded-md text-sm collapse-open"
                    style={{ fontSize: "0.95rem", padding: "0.25rem 0.5rem" }}
                  >
                    <div className="collapse-title font-medium flex items-center cursor-default select-none py-2 px-2">
                      <input
                        type="checkbox"
                        checked={categoryGroup.isSelected}
                        onChange={() => handleCategoryCheckboxChangeM1(categoryGroup.id)}
                        className="checkbox checkbox-primary checkbox-xs mr-2"
                      />
                      <span className="flex-1">{capitalizeFirst(categoryGroup.nombre)}</span>
                      <span className="badge badge-primary badge-xs">M1</span>
                    </div>
                    <div className="collapse-content block py-1 px-2">
                      <div className="ml-4 mt-1 space-y-1">
                        {categoryGroup.subcategorias.map((subcat) => (
                          <div key={subcat.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={subcat.isSelected}
                              onChange={() => handleSubCategoryCheckboxChangeM1(categoryGroup.id, subcat.id)}
                              className="checkbox checkbox-primary checkbox-xs mr-2"
                            />
                            <span>{capitalizeFirst(subcat.nombre)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Preview */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3">Seleccionados para subir:</h4>
                {extractedDataM1.filter(cat => cat.isSelected).length === 0 ? (
                  <p className="text-gray-500 text-sm">No hay categorías seleccionadas</p>
                ) : (
                  <ul className="space-y-3">
                    {extractedDataM1
                      .filter(cat => cat.isSelected)
                      .map(cat => (
                        <li key={cat.id} className="bg-white p-3 rounded-lg shadow-xs">
                          <div className="font-medium text-primary flex items-center">
                            <Check className="w-4 h-4 mr-2" />
                            {capitalizeFirst(cat.nombre)} <span className="badge badge-primary badge-sm ml-2">M1</span>
                          </div>
                          {cat.subcategorias.filter(sub => sub.isSelected).length > 0 && (
                            <ul className="mt-2 ml-6 space-y-1">
                              {cat.subcategorias
                                .filter(sub => sub.isSelected)
                                .map(sub => (
                                  <li key={sub.id} className="text-sm text-gray-600 flex items-center">
                                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                                    {capitalizeFirst(sub.nombre)}
                                  </li>
                                ))}
                            </ul>
                          )}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sección M2 (similar a M1) */}
      <div>
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="bg-purple-100 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Temario M2</h2>
        </div>

        {/* Upload Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-end">
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar archivo PDF</label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChangeM2}
                className="file-input file-input-bordered w-full"
              />
            </div>
            <button
              onClick={handleUploadM2}
              disabled={!selectedFileM2 || uploadStatusM2.includes("Subiendo")}
              className={`btn w-full sm:w-auto mt-2 sm:mt-0 ${!selectedFileM2 ? 'btn-disabled' : 'btn-primary'}`}
              style={{ minHeight: "42px" }}
            >
              {uploadStatusM2 === "Subiendo y procesando..." ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              Procesar PDF
            </button>
          </div>
          {/* Status Messages */}
          {uploadStatusM2 && (
            <div className={`mt-3 p-3 rounded-lg ${
              uploadStatusM2.includes("éxito") ? 'bg-green-50 text-green-700' : 
              uploadStatusM2.includes("Subiendo") ? 'bg-blue-50 text-blue-700' : 
              'bg-red-50 text-red-700'
            }`}>
              {uploadStatusM2}
            </div>
          )}
          {errorM2 && (
            <div className="mt-3 p-3 rounded-lg bg-red-50 text-red-700">
              {errorM2}
            </div>
          )}
        </div>

        {/* Extracted Data Section */}
        {extractedDataM2 && extractedDataM2.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h3 className="font-semibold text-gray-800">
                Categorías extraídas ({extractedDataM2.filter(c => c.isSelected).length} seleccionadas)
              </h3>
              <button
                onClick={handleBulkUploadToFirebaseM2}
                disabled={firebaseUploadStatusM2.includes("Subiendo")}
                className="btn btn-primary btn-sm w-full sm:w-auto"
              >
                {firebaseUploadStatusM2.includes("Subiendo") ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Subir a Firebase
              </button>
            </div>

            {firebaseUploadStatusM2 && (
              <div className={`p-3 ${
                firebaseUploadStatusM2.includes("éxito") ? 'bg-green-50 text-green-700' : 
                firebaseUploadStatusM2.includes("Subiendo") ? 'bg-blue-50 text-blue-700' : 
                'bg-red-50 text-red-700'
              }`}>
                {firebaseUploadStatusM2}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
              {/* Categories List */}
              <div className="space-y-2">
                {extractedDataM2.map((categoryGroup) => (
                  <div
                    key={categoryGroup.id}
                    className="collapse border border-gray-200 rounded-md text-sm collapse-open"
                    style={{ fontSize: "0.95rem", padding: "0.25rem 0.5rem" }}
                  >
                    <div className="collapse-title font-medium flex items-center cursor-default select-none py-2 px-2">
                      <input
                        type="checkbox"
                        checked={categoryGroup.isSelected}
                        onChange={() => handleCategoryCheckboxChangeM2(categoryGroup.id)}
                        className="checkbox checkbox-primary checkbox-xs mr-2"
                      />
                      <span className="flex-1">{capitalizeFirst(categoryGroup.nombre)}</span>
                      <span className="badge badge-primary badge-xs">M2</span>
                    </div>
                    <div className="collapse-content block py-1 px-2">
                      <div className="ml-4 mt-1 space-y-1">
                        {categoryGroup.subcategorias.map((subcat) => (
                          <div key={subcat.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={subcat.isSelected}
                              onChange={() => handleSubCategoryCheckboxChangeM2(categoryGroup.id, subcat.id)}
                              className="checkbox checkbox-primary checkbox-xs mr-2"
                            />
                            <span>{capitalizeFirst(subcat.nombre)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Preview */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3">Seleccionados para subir:</h4>
                {extractedDataM2.filter(cat => cat.isSelected).length === 0 ? (
                  <p className="text-gray-500 text-sm">No hay categorías seleccionadas</p>
                ) : (
                  <ul className="space-y-3">
                    {extractedDataM2
                      .filter(cat => cat.isSelected)
                      .map(cat => (
                        <li key={cat.id} className="bg-white p-3 rounded-lg shadow-xs">
                          <div className="font-medium text-primary flex items-center">
                            <Check className="w-4 h-4 mr-2" />
                            {capitalizeFirst(cat.nombre)} <span className="badge badge-primary badge-sm ml-2">M2</span>
                          </div>
                          {cat.subcategorias.filter(sub => sub.isSelected).length > 0 && (
                            <ul className="mt-2 ml-6 space-y-1">
                              {cat.subcategorias
                                .filter(sub => sub.isSelected)
                                .map(sub => (
                                  <li key={sub.id} className="text-sm text-gray-600 flex items-center">
                                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                                    {capitalizeFirst(sub.nombre)}
                                  </li>
                                ))}
                            </ul>
                          )}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};