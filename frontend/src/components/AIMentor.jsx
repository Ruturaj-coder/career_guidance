import React, { useState } from 'react';
import api from '../services/api';

function AIMentor() {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        // Add user message
        const userMessage = { type: 'user', content: query };
        setMessages(prev => [...prev, userMessage]);
        setLoading(true);

        try {
            const response = await api.getMentorResponse(query);
            // Add AI response
            const aiMessage = { type: 'ai', content: response.response };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error getting mentor response:', error);
            const errorMessage = { type: 'error', content: 'Sorry, I encountered an error. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        }

        setLoading(false);
        setQuery('');
    };

    return (
        <div>
            <h2>AI Career Mentor</h2>
            
            <div className="chat-container">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.type}`}>
                        <strong>{message.type === 'user' ? 'You' : 'AI Mentor'}:</strong>
                        <p>{message.content}</p>
                    </div>
                ))}
                {loading && <div className="message loading">AI is thinking...</div>}
            </div>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about your career..."
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    Send
                </button>
            </form>
        </div>
    );
}

export default AIMentor; 