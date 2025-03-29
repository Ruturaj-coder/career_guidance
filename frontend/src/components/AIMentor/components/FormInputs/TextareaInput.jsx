import React from 'react';

function TextareaInput({ placeholder, value, onChange, className }) {
    return (
        <textarea
            placeholder={placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={className || 'form-textarea'}
            rows="3"
        />
    );
}

export default TextareaInput; 