import React, { useState } from 'react';

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const DynamicFormCard = ({ model, data = {}, onDataChange, readOnly = false }) => {
  const [newArrayItem, setNewArrayItem] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const handleChange = (e) => {
    if (!onDataChange || readOnly) return;

    const { name, value, type, checked } = e.target;
    const [mainField, subField] = name.split('.');

    const parseValue = (val, fieldType) => {
      if (fieldType === 'number') return val === '' ? null : Number(val);
      if (fieldType === 'boolean') return checked;
      return val;
    };

    const getFieldSchema = (fieldName, fields) => 
      fields?.find(f => f.name === fieldName) || {};

    let fieldSchema;
    if (subField) {
      const parentSchema = getFieldSchema(mainField, model?.campos);
      fieldSchema = getFieldSchema(subField, parentSchema?.fields);
    } else {
      fieldSchema = getFieldSchema(name, model?.campos);
    }

    const finalValue = parseValue(value, fieldSchema?.type);

    if (subField) {
      onDataChange(prevData => ({
        ...prevData,
        [mainField]: {
          ...(prevData[mainField] || {}),
          [subField]: finalValue
        }
      }));
    } else {
      onDataChange(prevData => ({
        ...prevData,
        [name]: finalValue
      }));
    }
  };

  const handleArrayChange = (fieldName, index, newValue) => {
    onDataChange(prevData => {
      const newArray = [...(prevData[fieldName] || [])];
      newArray[index] = newValue;
      return {
        ...prevData,
        [fieldName]: newArray
      };
    });
  };

  const handleAddArrayItem = (fieldName) => {
    if (!newArrayItem.trim()) return;
    
    onDataChange(prevData => ({
      ...prevData,
      [fieldName]: [...(prevData[fieldName] || []), newArrayItem]
    }));
    
    setNewArrayItem('');
    setCurrentPage(1);
  };

  const handleRemoveArrayItem = (fieldName, index) => {
    onDataChange(prevData => {
      const newArray = [...(prevData[fieldName] || [])];
      newArray.splice(index, 1);
      return {
        ...prevData,
        [fieldName]: newArray
      };
    });

    // Ajustar la página si quedó vacía
    const arrayLength = (data[fieldName] || []).length;
    const totalPages = Math.ceil((arrayLength - 1) / itemsPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  };

  const getFieldValue = (fieldName, parentFieldName, parentValue) => {
    if (parentFieldName) {
      return (parentValue || {})[fieldName];
    }
    return data[fieldName];
  };

  const renderArrayInput = (fieldSchema) => {
    const fieldName = fieldSchema.name;
    const value = data[fieldName] || [];
    const disabledAttr = readOnly || fieldSchema.disabled;

    // Lógica de paginación
    const totalItems = value.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentItems = value.slice(startIndex, endIndex);


    return (
      <div className="space-y-2">
        <ul className="menu bg-base-200 rounded-box">
          {currentItems.map((item, index) => {
            const globalIndex = startIndex + index;
            return (
              <li key={index} className="list-row flex items-center">
              <div className='join gap-0'>
                <input
                  type="text"
                  className="input input-bordered input-xs w-full join-item"
                  value={item}
                  onChange={(e) => handleArrayChange(fieldName, index, e.target.value)}
                  disabled={disabledAttr}
                />
                {!disabledAttr && (
                  <button
                    type="button"
                    className="btn btn-xs join-item"
                    onClick={() => handleRemoveArrayItem(fieldName, index)}
                  >
                    <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
                    </svg>
                  </button>
                )}
              </div>
            </li>
            );   
          })}
        </ul>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              className="btn btn-xs btn-ghost"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              «
            </button>
            <span className="text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <button
              className="btn btn-xs btn-ghost"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              »
            </button>
          </div>
        )}
        
        {!disabledAttr && (
          <div className="flex gap-2">
            <input
              type="text"
              className="input input-bordered input-xs w-full"
              placeholder="Nuevo elemento"
              value={newArrayItem}
              onChange={(e) => setNewArrayItem(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-square btn-primary btn-xs"
              onClick={() => handleAddArrayItem(fieldName)}
            >
              <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderInput = (fieldSchema, parentFieldName = '', parentValue) => {
    const fullFieldName = parentFieldName ? `${parentFieldName}.${fieldSchema.name}` : fieldSchema.name;
    const value = getFieldValue(fieldSchema.name, parentFieldName, parentValue);
    const disabledAttr = readOnly || fieldSchema.disabled;

    const commonProps = {
      name: fullFieldName,
      disabled: disabledAttr,
      className: `input input-bordered input-xs w-full ${disabledAttr ? '!bg-base-300' : ''}`,
      value: value !== undefined && value !== null ? value : '',
      onChange: handleChange
    };

    switch (fieldSchema.type) {
      case 'array':
        return renderArrayInput(fieldSchema);
      case 'select':
        return (
          <select {...commonProps} className={`select select-bordered select-xs w-full ${disabledAttr ? '!bg-base-300' : ''}`}>
            <option value="">Seleccionar...</option>
            {(fieldSchema.options || []).map(option => (
              <option key={option} value={option}>
                {capitalize(option)}
              </option>
            ))}
          </select>
        );
      case 'boolean':
        return (
          <input
            type="checkbox"
            className="toggle toggle-primary toggle-xs"
            name={fullFieldName}
            checked={!!value}
            onChange={handleChange}
            disabled={disabledAttr}
          />
        );
      case 'timestamp':
        const dateValue = value && value._seconds 
          ? new Date(value._seconds * 1000 + value._nanoseconds / 1000000)
          : '';
        return (
          <input
            type="text"
            className={`input input-bordered input-xs w-full ${disabledAttr ? '!bg-base-300' : ''}`}
            name={fullFieldName}
            value={dateValue}
            disabled={disabledAttr}
            onChange={handleChange}
          />
        );
      case 'number':
        return <input type="number" {...commonProps} />;
      case 'email':
        return <input type="email" {...commonProps} />;
      case 'string':
      default:
        return <input type="text" {...commonProps} />;
    }
  };

  const renderField = (fieldSchema, parentFieldName = '') => {
    if (!fieldSchema || !fieldSchema.name) return null;

    const fullFieldName = parentFieldName ? `${parentFieldName}.${fieldSchema.name}` : fieldSchema.name;
    const fieldValue = getFieldValue(fieldSchema.name, parentFieldName, data[parentFieldName]);
    const labelClasses = `fieldset-legend capitalize !p-[5px] ${fieldSchema.disabled ? 'text-base-content' : ''}`;

    if (fieldSchema.type === 'object' && fieldSchema.fields) {
      return (
        <fieldset key={fullFieldName} className="fieldset bg-base-200 border-base-300 rounded-box w-full border-2 p-4">
          <legend className="fieldset-legend text-sm font-bold">
            {fieldSchema.label || capitalize(fieldSchema.name)}
          </legend>
          {(fieldSchema.fields || []).map(subField => (
            <div key={`${fullFieldName}.${subField.name}`} className="mb-2">
              <label className={labelClasses}>
                {subField.label || capitalize(subField.name)}
              </label>
              {renderInput(subField, fullFieldName, fieldValue)}
            </div>
          ))}
        </fieldset>
      );
    }

    return (
      <div key={fullFieldName} className="mb-2">
        <label className={labelClasses}>
          {fieldSchema.label || capitalize(fieldSchema.name)}
        </label>
        {renderInput(fieldSchema, parentFieldName)}
      </div>
    );
  };

  if (!model?.campos) {
    return <div className="text-error">Error: Modelo inválido proporcionado a DynamicFormCard.</div>;
  }

  return (
    <div className="card bg-base-200 shadow-sm">
      <fieldset className="fieldset p-4">
        {(model.campos || []).map(field => renderField(field))}
      </fieldset>
    </div>
  );
};

export default DynamicFormCard;