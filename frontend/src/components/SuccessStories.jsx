import React, { useState, useEffect } from 'react';
import api from '../services/api';

function SuccessStories() {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const data = await api.getSuccessStories();
                setStories(data);
            } catch (error) {
                console.error('Error fetching success stories:', error);
            }
            setLoading(false);
        };

        fetchStories();
    }, []);

    if (loading) {
        return <div>Loading success stories...</div>;
    }

    return (
        <div>
            <h2>Career Success Stories</h2>
            
            <div className="stories-container">
                {stories.map(story => (
                    <div key={story.id} className="story-card">
                        <h3>{story.name}</h3>
                        <h4>{story.field}</h4>
                        <p>{story.story}</p>
                    </div>
                ))}
            </div>

            {stories.length === 0 && (
                <p>No success stories available at the moment.</p>
            )}
        </div>
    );
}

export default SuccessStories; 