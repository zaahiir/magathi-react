import React, { useState } from 'react';
import { FaExclamationCircle, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { validateField } from '../../../utils/validation';

const FormField = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  validation, 
  placeholder,
  helpText,
  required = false,
  disabled = false,
  className = '',
  showPasswordToggle = true
}) => {
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (validation) {
      const validationError = validateField(newValue, validation);
      setError(validationError);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (validation) {
      const validationError = validateField(value, validation);
      setError(validationError);
    }
  };

  const inputClasses = `
    w-full px-3 py-2 border rounded-lg transition-all duration-200
    ${error 
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
      : isFocused 
        ? 'border-[#53755d] ring-2 ring-[#53755d]/20 focus:border-[#53755d]' 
        : 'border-gray-300 focus:border-[#53755d] focus:ring-1 focus:ring-[#53755d]/20'
    }
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    ${className}
  `;

  const renderInput = () => {
    if (type === 'password') {
      return (
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={value || ''}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`${inputClasses} ${showPasswordToggle ? 'pr-10' : ''}`}
            placeholder={placeholder}
            disabled={disabled}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              disabled={disabled}
            >
              {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
            </button>
          )}
        </div>
      );
    }

    if (type === 'textarea') {
      return (
        <textarea
          value={value || ''}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`${inputClasses} resize-none`}
          placeholder={placeholder}
          disabled={disabled}
          rows={3}
        />
      );
    }

    if (type === 'select') {
      return (
        <select
          value={value || ''}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={inputClasses}
          disabled={disabled}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {validation?.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={type}
        value={value || ''}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={inputClasses}
        placeholder={placeholder}
        disabled={disabled}
        min={validation?.min}
        max={validation?.max}
        step={validation?.step}
      />
    );
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {renderInput()}
      
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <FaExclamationCircle className="h-3 w-3 mr-1 flex-shrink-0" />
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default FormField;
