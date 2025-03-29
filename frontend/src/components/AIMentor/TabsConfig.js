export const tabs = [
    { 
        id: 'general', 
        label: 'General Advice', 
        endpoint: '/mentor',
        fields: []
    },
    { 
        id: 'skills', 
        label: 'Skills Analysis', 
        endpoint: '/mentor/skills-gap',
        fields: [
            { name: 'current_skills', label: 'Your Current Skills', type: 'tags', placeholder: 'e.g., JavaScript, Python, React' },
            { name: 'target_role', label: 'Target Role', type: 'text', placeholder: 'e.g., Software Developer' },
            { name: 'experience_level', label: 'Experience Level', type: 'select', options: ['Entry Level', 'Mid Level', 'Senior Level'] },
            { name: 'location', label: 'Location', type: 'text', placeholder: 'e.g., United States, Remote' }
        ]
    },
    { 
        id: 'salary', 
        label: 'Salary Insights', 
        endpoint: '/mentor/salary-benchmark',
        fields: [
            { name: 'role', label: 'Job Role', type: 'text', placeholder: 'e.g., Software Developer' },
            { name: 'location', label: 'Location', type: 'text', placeholder: 'e.g., United States' },
            { name: 'experience_years', label: 'Years of Experience', type: 'number', placeholder: '0' },
            { name: 'skills', label: 'Key Skills', type: 'tags', placeholder: 'e.g., React, Node.js, Python' }
        ]
    },
    { 
        id: 'portfolio', 
        label: 'Portfolio Guide', 
        endpoint: '/mentor/portfolio-guidance',
        fields: [
            { name: 'target_role', label: 'Target Role', type: 'text', placeholder: 'e.g., Frontend Developer' },
            { name: 'current_skills', label: 'Current Skills', type: 'tags', placeholder: 'e.g., HTML, CSS, JavaScript' },
            { name: 'experience_level', label: 'Experience Level', type: 'select', options: ['Entry Level', 'Mid Level', 'Senior Level'] },
            { name: 'interests', label: 'Areas of Interest', type: 'tags', placeholder: 'e.g., Web Development, UI/UX, Mobile Apps' }
        ]
    },
    { 
        id: 'networking', 
        label: 'Networking Tips', 
        endpoint: '/mentor/networking-script',
        fields: [
            { name: 'user_name', label: 'Your Name', type: 'text', placeholder: 'e.g., John Doe' },
            { name: 'target_contact_role', label: 'Target Contact Role', type: 'text', placeholder: 'e.g., Engineering Manager' },
            { name: 'shared_interests', label: 'Shared Interests', type: 'tags', placeholder: 'e.g., Technology, AI, Startups' },
            { name: 'platform', label: 'Platform', type: 'select', options: ['LinkedIn', 'Email', 'In Person', 'Twitter'] }
        ]
    },
    { 
        id: 'confidence', 
        label: 'Confidence Building', 
        endpoint: '/mentor/confidence-building',
        fields: [
            { name: 'context', label: 'Context', type: 'text', placeholder: 'e.g., Job Interview, Public Speaking' },
            { name: 'past_experiences', label: 'Past Experiences', type: 'textarea', placeholder: 'Describe your past experiences...' }
        ]
    },
    { 
        id: 'stress', 
        label: 'Stress Management', 
        endpoint: '/mentor/stress-management',
        fields: [
            { name: 'current_situation', label: 'Current Situation', type: 'textarea', placeholder: 'Describe your current situation...' },
            { name: 'stress_factors', label: 'Stress Factors', type: 'tags', placeholder: 'e.g., Deadlines, Work-Life Balance' },
            { name: 'previous_strategies', label: 'Previous Strategies', type: 'tags', placeholder: 'e.g., Meditation, Exercise' }
        ]
    }
]; 