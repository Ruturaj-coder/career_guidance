import React, { useState } from 'react';
import api from '../services/api';

function RoadmapGenerator() {
    const [formData, setFormData] = useState({
        careerField: '',
        experienceLevel: 'beginner',
        interests: []
    });
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);

    const experienceLevels = ['beginner', 'intermediate', 'advanced'];

    const handleInterestChange = (e) => {
        const interest = e.target.value.trim();
        if (interest && e.key === 'Enter') {
            e.preventDefault();
            setFormData(prev => ({
                ...prev,
                interests: [...prev.interests, interest]
            }));
            e.target.value = '';
        }
    };

    const removeInterest = (index) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.generateRoadmap(
                formData.careerField,
                formData.experienceLevel,
                formData.interests
            );
            setRoadmap(response.roadmap);
        } catch (error) {
            console.error('Error generating roadmap:', error);
            alert('Failed to generate roadmap. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div>
            <h2>Career Roadmap Generator</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Career Field:</label>
                    <input
                        type="text"
                        value={formData.careerField}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            careerField: e.target.value
                        }))}
                        required
                        placeholder="e.g., Software Development"
                    />
                </div>

                <div>
                    <label>Experience Level:</label>
                    <select
                        value={formData.experienceLevel}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            experienceLevel: e.target.value
                        }))}
                    >
                        {experienceLevels.map(level => (
                            <option key={level} value={level}>
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Interests (Press Enter to add):</label>
                    <input
                        type="text"
                        onKeyPress={handleInterestChange}
                        placeholder="e.g., AI, Web Development"
                    />
                    <div className="interests-list">
                        {formData.interests.map((interest, index) => (
                            <span key={index} className="interest-tag">
                                {interest}
                                <button type="button" onClick={() => removeInterest(index)}>×</button>
                            </span>
                        ))}
                    </div>
                </div>

                <button type="submit" disabled={loading || !formData.careerField}>
                    {loading ? 'Generating...' : 'Generate Roadmap'}
                </button>
            </form>

            {roadmap && (
                <div className="roadmap-result">
                    <h3>Your Career Roadmap</h3>
                    <div className="roadmap-content">
                        {roadmap.split('\n').map((step, index) => (
                            <p key={index}>{step}</p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default RoadmapGenerator; 