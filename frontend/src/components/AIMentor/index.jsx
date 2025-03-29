import React, { useState } from 'react';
import { tabs } from './TabsConfig';
import TabsContainer from './components/TabsContainer';
import QueryForm from './components/QueryForm';
import ResponseDisplay from '../common/ResponseDisplay';
import useFormData from './hooks/useFormData';

function AIMentor() {
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState('general');
    const { formData, loading, error, response, handleInputChange, makeApiCall } = useFormData();

    const selectedTab = tabs.find(tab => tab.id === activeTab);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setFormData({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        await makeApiCall(selectedTab.endpoint, query, activeTab, selectedTab.fields);
        setQuery('');
    };

    return (
        <div className="ai-mentor">
            <h2>AI Career Mentor</h2>
            
            <TabsContainer
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />
            
            <QueryForm
                selectedTab={selectedTab}
                formData={formData}
                onInputChange={handleInputChange}
                query={query}
                onQueryChange={setQuery}
                onSubmit={handleSubmit}
                loading={loading}
            />

            <ResponseDisplay
                loading={loading}
                error={error}
                response={response}
                activeTab={activeTab}
            />
        </div>
    );
}

export default AIMentor; 