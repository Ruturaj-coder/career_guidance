import React from 'react';
import TextInput from './FormInputs/TextInput';
import NumberInput from './FormInputs/NumberInput';
import SelectInput from './FormInputs/SelectInput';
import TagsInput from './FormInputs/TagsInput';
import TextareaInput from './FormInputs/TextareaInput';

function FormFields({ fields, formData, onInputChange }) {
    const renderField = (field) => {
        const value = formData[field.name];
        const handleChange = (newValue) => onInputChange(field.name, newValue);

        switch (field.type) {
            case 'text':
                return (
                    <TextInput
                        placeholder={field.placeholder}
                        value={value}
                        onChange={handleChange}
                    />
                );
            case 'number':
                return (
                    <NumberInput
                        placeholder={field.placeholder}
                        value={value}
                        onChange={handleChange}
                    />
                );
            case 'select':
                return (
                    <SelectInput
                        label={field.label}
                        value={value}
                        onChange={handleChange}
                        options={field.options}
                    />
                );
            case 'tags':
                return (
                    <TagsInput
                        placeholder={field.placeholder}
                        value={value}
                        onChange={handleChange}
                    />
                );
            case 'textarea':
                return (
                    <TextareaInput
                        placeholder={field.placeholder}
                        value={value}
                        onChange={handleChange}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="form-fields">
            {fields.map(field => (
                <div key={field.name} className="form-group">
                    <label>{field.label}</label>
                    {renderField(field)}
                </div>
            ))}
        </div>
    );
}

export default FormFields; 