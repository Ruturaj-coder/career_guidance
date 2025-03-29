import React from 'react';

function NumberInput({ placeholder, value, onChange, className }) {
    return (
        <input
            type="number"
            placeholder={placeholder}
            value={value || ''}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            className={className || 'form-input'}
        />
    );
}

export default NumberInput; 