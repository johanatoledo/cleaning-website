import React from 'react';
import { useNavigate } from 'react-router-dom';
import houseCleaning from '../assets/casas.png';
import deepCleaning from '../assets/limpiezaprofunda.png';
import moveCleaning from '../assets/movcleaning.png';
import preparationCleaning from '../assets/limpiezaPreparacion.png';
import officeCleaning from '../assets/oficina.png';
import apartmentCleaning from '../assets/apartamento.png';

const services = [
    {
        id: 1,
        code: 'house_cleaning',
        title: 'House cleaning',
        description: 'Periodic maintenance for your home.',
        image: houseCleaning,
        alt: 'Regular cleaning'
    },
    {
        id: 2,
        code: 'deep_cleaning',
        title: 'Deep cleaning',
        description: 'Complete detail for all areas.',
        image: deepCleaning,
        alt: 'Deep cleaning'
    },
    {
        id: 3,
        code: 'move_in_cleaning',
        title: 'Move-In Cleaning',
        description: 'Move-In/Move-Out cleaning.',
        image: moveCleaning,
        alt: 'Move-In Cleaning'
    },
    {
        id: 4,
        code: 'preparation_cleaning',
        title: 'Preparation cleaning',
        description: 'Ideal before events or deliveries.',
        image: preparationCleaning,
        alt: 'Preparation cleaning'
    },
    {
        id: 5,
        code: 'office_cleaning',
        title: 'Office Cleaning',
        description: 'Ideal for the day to day of your business',
        image: officeCleaning,
        alt: 'Office cleaning'
    },
    {
        id: 6,
        code: 'apartment_cleaning',
        title: 'Apartment Cleaning',
        description: 'Periodic maintenance for your home.',
        image: apartmentCleaning,
        alt: 'Apartment cleaning'
    }
];

export default function ServicesSection() {
    const navigate = useNavigate();

    const handleReserve = (serviceCode) => {
        navigate('/booking', { state: { serviceCode } });
    };

    return (
        <section id='services' className='py-5'>
            <div className='container'>
                <h2 className='text-center mb-4' style={{ color: 'var(--pristine-green) !important' }}>
                    Cleaning services
                </h2>
                <div className='row g-4 '>
                    {services.map((service) => (
                        <div className='col-md-4' key={service.id}>
                            <div className='card h-100 advantage-card'>
                                <img src={service.image} className='card-img-top' alt={service.alt} />
                                <div className='card-body'>
                                    <h5 className='card-title lyrics-green'>{service.title}</h5>
                                    <p className='card-text'>{service.description}</p>
                                    <button
                                        onClick={() => handleReserve(service.code)}
                                        className='btn btn-custom btn-outline-primary'
                                    >
                                        Reserve
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
