import React, { useState } from 'react';
import api from '../services/api';

function CounselingBooking() {
    const [formData, setFormData] = useState({
        counselor_id: '',
        session_type: 'chat',
        preferred_date: '',
        preferred_time: '',
        user_id: '1' // Hardcoded for demo
    });
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(false);

    // Mock counselors data (in a real app, this would come from an API)
    const counselors = [
        { id: '1', name: 'Dr. Sarah Johnson', specialization: 'Career Transition' },
        { id: '2', name: 'Prof. Michael Chen', specialization: 'Technical Careers' },
        { id: '3', name: 'Ms. Emily Parker', specialization: 'Student Guidance' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.scheduleCounseling(formData);
            setBooking(response);
        } catch (error) {
            console.error('Error booking session:', error);
            alert('Failed to book session. Please try again.');
        }

        setLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div>
            <h2>Book a Counseling Session</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Select Counselor:</label>
                    <select
                        name="counselor_id"
                        value={formData.counselor_id}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Choose a counselor</option>
                        {counselors.map(counselor => (
                            <option key={counselor.id} value={counselor.id}>
                                {counselor.name} - {counselor.specialization}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Session Type:</label>
                    <select
                        name="session_type"
                        value={formData.session_type}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="chat">Chat Session</option>
                        <option value="video">Video Session</option>
                    </select>
                </div>

                <div>
                    <label>Preferred Date:</label>
                    <input
                        type="date"
                        name="preferred_date"
                        value={formData.preferred_date}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <div>
                    <label>Preferred Time:</label>
                    <input
                        type="time"
                        name="preferred_time"
                        value={formData.preferred_time}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Booking...' : 'Book Session'}
                </button>
            </form>

            {booking && (
                <div className="booking-confirmation">
                    <h3>Booking Confirmed!</h3>
                    <p>Session ID: {booking.id}</p>
                    <p>Type: {booking.session_type}</p>
                    <p>Date: {booking.preferred_date}</p>
                    <p>Time: {booking.preferred_time}</p>
                    {booking.meeting_link && (
                        <p>Meeting Link: <a href={booking.meeting_link} target="_blank" rel="noopener noreferrer">
                            {booking.meeting_link}
                        </a></p>
                    )}
                </div>
            )}
        </div>
    );
}

export default CounselingBooking; 