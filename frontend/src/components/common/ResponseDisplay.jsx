import React from 'react';
import ReactMarkdown from 'react-markdown';

function ResponseDisplay({ loading, error, response, activeTab }) {
    if (loading) {
        return <div className="loading">Loading your response...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!response || !response[activeTab]) {
        return null;
    }

    const formatResponse = (text) => {
        if (!text || text === 'Loading...') {
            return <div className="no-response">No response available yet. Try asking a question!</div>;
        }

        // Split response into sections based on headers
        const sections = text.split(/(?=###\s)/).filter(section => section.trim());

        if (sections.length === 0) {
            // If no sections found, create cards based on paragraphs or bullet points
            const paragraphs = text
                .split('\n')
                .filter(p => p.trim())
                .map(p => p.trim());

            return (
                <div className="response-cards">
                    {paragraphs.map((paragraph, index) => {
                        // Convert bullet points to proper markdown list items
                        const cleanContent = paragraph
                            .replace(/^[*•-]\s*/g, '- ')  // Convert bullets to markdown list items
                            .replace(/\*\*?(.*?)\*\*?/g, '**$1**')  // Ensure proper bold syntax
                            .trim();

                        return (
                            <div key={index} className="response-card">
                                <ReactMarkdown>{cleanContent}</ReactMarkdown>
                            </div>
                        );
                    })}
                </div>
            );
        }

        return (
            <div className="response-cards">
                {sections.map((section, index) => {
                    // Extract title and content
                    const [firstLine, ...rest] = section.split('\n');
                    const title = firstLine.replace('### ', '').replace(':', '');
                    const content = rest
                        .join('\n')
                        .trim()
                        .replace(/^[*•-]\s*/gm, '- ')  // Convert bullets to markdown list items
                        .replace(/\*\*?(.*?)\*\*?/g, '**$1**');  // Ensure proper bold syntax

                    return (
                        <div key={index} className="response-card">
                            <h3>{title}</h3>
                            <ReactMarkdown>{content}</ReactMarkdown>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="response-container">
            <div className="tab-content">
                {formatResponse(response[activeTab])}
            </div>
        </div>
    );
}

export default ResponseDisplay; 