import React from 'react';

function TagsInput({ placeholder, value, onChange, className }) {
    const handleChange = (inputValue) => {
        const tags = inputValue.split(',').map(tag => tag.trim()).filter(tag => tag);
        onChange(tags);
    };

    return (
        <input
            type="text"
            placeholder={placeholder}
            value={Array.isArray(value) ? value.join(', ') : ''}
            onChange={(e) => handleChange(e.target.value)}
            className={className || 'form-input'}
        />
    );
}

export default TagsInput; 