import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      className = '',
      startIcon,
      endIcon,
      ...props
    },
    ref
  ) => {
    const inputClasses = `
      input-animate
      block px-4 py-3 w-full
      bg-white border rounded-lg
      focus:outline-none
      transition-all duration-250
      ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#FFD700]'}
      ${startIcon ? 'pl-10' : ''}
      ${endIcon ? 'pr-10' : ''}
      ${className}
    `;

    const containerClasses = `
      mb-4
      ${fullWidth ? 'w-full' : ''}
    `;

    return (
      <div className={containerClasses}>
        {label && (
          <label className="block mb-2 font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              {startIcon}
            </div>
          )}
          <input ref={ref} className={inputClasses} {...props} />
          {endIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
              {endIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
