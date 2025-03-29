import { useState } from 'react';

function useFormData() {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState({});

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getRequestBody = (endpoint, query, activeTab, formFields) => {
        const conciseQuery = `${query} Please provide a concise response with key points only. Limit to 3-4 main points.`;
        
        // Start with the basic query
        let body = { query: conciseQuery };

        // Add form data if available
        if (formFields.length > 0) {
            switch (endpoint) {
                case '/mentor/networking-script':
                    return {
                        user_name: formData.user_name || 'User',
                        target_contact_role: formData.target_contact_role || '',
                        shared_interests: formData.shared_interests || [],
                        platform: formData.platform?.toLowerCase() || 'linkedin',
                        purpose: conciseQuery
                    };
                case '/mentor/confidence-building':
                    return {
                        query: conciseQuery,
                        context: formData.context || 'Career Development',
                        past_experiences: formData.past_experiences ? [formData.past_experiences] : []
                    };
                default:
                    formFields.forEach(field => {
                        if (formData[field.name]) {
                            body[field.name] = formData[field.name];
                        }
                    });
                    return body;
            }
        }
        return body;
    };

    const makeApiCall = async (endpoint, query, activeTab, formFields) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8000/uccha-shiksha/career-guidance${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(getRequestBody(endpoint, query, activeTab, formFields))
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to get response');
            }

            const result = await response.json();
            setResponse(prev => ({
                ...prev,
                [activeTab]: result.response || result.analysis || result.benchmark || 
                            result.guidance || result.script || result.strategies
            }));
        } catch (err) {
            setError(`Failed to get ${activeTab} advice. Please try again.`);
            console.error('Error:', err);
        }

        setLoading(false);
    };

    return {
        formData,
        loading,
        error,
        response,
        handleInputChange,
        makeApiCall,
        setFormData
    };
}

export default useFormData; 