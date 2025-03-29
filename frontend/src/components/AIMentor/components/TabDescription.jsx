import React from 'react';

function TabDescription({ activeTab }) {
    const getDescription = () => {
        switch (activeTab) {
            case 'general':
                return "Get general career advice and guidance";
            case 'skills':
                return "Analyze your skills gap for your target role";
            case 'salary':
                return "Get salary insights and benchmarks";
            case 'portfolio':
                return "Receive guidance on building your portfolio";
            case 'networking':
                return "Learn effective networking strategies";
            case 'confidence':
                return "Build your confidence and overcome challenges";
            case 'stress':
                return "Get tips for managing career-related stress";
            default:
                return "";
        }
    };

    return (
        <div className="tab-description">
            {getDescription()}
        </div>
    );
}

export default TabDescription; 