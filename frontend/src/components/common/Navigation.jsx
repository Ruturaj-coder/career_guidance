import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
    const menuItems = [
        { path: '/', label: 'AI Mentor' },
        { path: '/roadmap', label: 'Roadmap Generator' },
        { path: '/counseling', label: 'Book Counseling' },
        { path: '/success-stories', label: 'Success Stories' }
    ];

    return (
        <nav>
            <ul>
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <Link to={item.path}>{item.label}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Navigation; 