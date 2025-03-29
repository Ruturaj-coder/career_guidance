import React from 'react';
import TabDescription from './TabDescription';

function TabsContainer({ tabs, activeTab, onTabChange }) {
    return (
        <div className="tabs-container">
            <div className="tabs">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        className={activeTab === tab.id ? 'active' : ''}
                        onClick={() => onTabChange(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <TabDescription activeTab={activeTab} />
        </div>
    );
}

export default TabsContainer; 