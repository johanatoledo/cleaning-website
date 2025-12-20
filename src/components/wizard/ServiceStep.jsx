import React from 'react';
import { useBooking } from '../../context/useBookingHooks';

const serviceOptions = [
    {
        code: 'house_cleaning',
        name: 'House Cleaning',
        description: 'Regular Maintenance',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-3-3.87"/><path d="M4 21v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/></svg>
    },
    {
        code: 'deep_cleaning',
        name: 'Deep Cleaning',
        description: 'Deep Detail',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-8 8-3 9 9-3 8-8-6-6z"/><path d="M22 2l-6 6"/></svg>
    },
    {
        code: 'preparation_cleaning',
        name: 'Preparation Cleaning',
        description: 'Before event/delivery',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
    },
    {
        code: 'move_in_cleaning',
        name: 'Move-In Cleaning',
        description: 'Move-In/Move-Out',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v4H3z"/><path d="M16 7v13a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V7"/></svg>
    },
    {
        code: 'apartment_cleaning',
        name: 'Apartment cleaning',
        description: 'Efficient and agile',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7h14v14"/><path d="M9 21V10"/><path d="M15 21V14"/></svg>
    },
    {
        code: 'office_cleaning',
        name: 'Office',
        description: 'Productive environment',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 3h-1a2 2 0 0 0-2 2v2H7V5a2 2 0 0 0-2-2H4"/></svg>
    }
];

export default function ServiceStep() {
    const { booking, updateBooking, setCurrentStep } = useBooking();

    const handleServiceSelect = (code) => {
        updateBooking('serviceCode', code);
        setCurrentStep(2);
    };

    return (
        <div className="row g-3">
            {serviceOptions.map((service) => (
                <div className="col-6 col-md-4" key={service.code}>
                    <div
                        className={`card h-100 border-0 shadow-soft cursor-pointer ${booking.serviceCode === service.code ? 'selected' : ''}`}
                        data-service={service.code}
                        onClick={() => handleServiceSelect(service.code)}
                    >
                        <div className="card-body text-center">
                            <div className="icon-circle mb-2">{service.icon}</div>
                            <div className="fw-bold">{service.name}</div>
                            <div className="small text-muted">{service.description}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}