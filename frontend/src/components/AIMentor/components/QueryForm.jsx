import React from 'react';
import FormFields from './FormFields';

function QueryForm({ selectedTab, formData, onInputChange, query, onQueryChange, onSubmit, loading }) {
    return (
        <form onSubmit={onSubmit} className="query-form">
            {selectedTab.fields.length > 0 && (
                <FormFields
                    fields={selectedTab.fields}
                    formData={formData}
                    onInputChange={onInputChange}
                />
            )}
            
            <div className="query-input-group">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder={`Ask about ${selectedTab.label.toLowerCase()}...`}
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send'}
                </button>
            </div>
        </form>
    );
}

export default QueryForm; 