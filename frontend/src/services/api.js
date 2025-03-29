import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/uccha-shiksha/career-guidance';

const api = {
    // AI Mentor
    getMentorResponse: async (query) => {
        const response = await axios.post(`${API_BASE_URL}/mentor`, { query });
        return response.data;
    },

    // Roadmap Generator
    generateRoadmap: async (careerField, experienceLevel, interests) => {
        const response = await axios.post(`${API_BASE_URL}/roadmap`, {
            career_field: careerField,
            experience_level: experienceLevel,
            interests
        });
        return response.data;
    },

    // Counseling Sessions
    scheduleCounseling: async (sessionData) => {
        const response = await axios.post(`${API_BASE_URL}/schedule`, sessionData);
        return response.data;
    },

    // Success Stories
    getSuccessStories: async () => {
        const response = await axios.get(`${API_BASE_URL}/success-stories`);
        return response.data;
    }
};

export default api; 