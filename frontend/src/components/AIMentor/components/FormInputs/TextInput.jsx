import React from 'react';

function TextInput({ placeholder, value, onChange, className }) {
    return (
        <input
            type="text"
            placeholder={placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={className || 'form-input'}
        />
    );
}

export default TextInput; 