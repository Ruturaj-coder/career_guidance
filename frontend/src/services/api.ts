import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/uccha-shiksha/career-guidance';

// Types
export interface UserSkills {
    current_skills: string[];
    target_role: string;
    experience_level: string;
    location: string;
}

export interface SalaryRequest {
    role: string;
    location: string;
    experience_years: number;
    skills: string[];
}

export interface NetworkingRequest {
    user_name: string;
    target_contact_role: string;
    shared_interests: string[];
    purpose: string;
    platform: 'linkedin' | 'email';
}

export interface PortfolioRequest {
    target_role: string;
    current_skills: string[];
    experience_level: string;
    interests: string[];
}

export interface StressManagementRequest {
    current_situation: string;
    stress_factors: string[];
    previous_strategies?: string[];
}

export interface ConfidenceRequest {
    query: string;
    context: string;
    past_experiences?: string[];
}

// API calls
export const mentorApi = {
    analyzeSkills: async (data: UserSkills) => {
        const response = await axios.post(`${API_BASE_URL}/mentor/skills-gap`, data);
        return response.data;
    },

    getSalaryBenchmark: async (data: SalaryRequest) => {
        const response = await axios.post(`${API_BASE_URL}/mentor/salary-benchmark`, data);
        return response.data;
    },

    getPortfolioGuidance: async (data: PortfolioRequest) => {
        const response = await axios.post(`${API_BASE_URL}/mentor/portfolio-guidance`, data);
        return response.data;
    },

    generateNetworkingScript: async (data: NetworkingRequest) => {
        const response = await axios.post(`${API_BASE_URL}/mentor/networking-script`, data);
        return response.data;
    },

    buildConfidence: async (data: ConfidenceRequest) => {
        const response = await axios.post(`${API_BASE_URL}/mentor/confidence-building`, data);
        return response.data;
    },

    manageStress: async (data: StressManagementRequest) => {
        const response = await axios.post(`${API_BASE_URL}/mentor/stress-management`, data);
        return response.data;
    }
};

export default mentorApi; 