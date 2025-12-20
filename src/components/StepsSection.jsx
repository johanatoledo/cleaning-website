import React from 'react';

const steps = [
    {
        number: 1,
        title: 'Choose the service',
        description: 'Select regular cleaning, deep cleaning, move-out cleaning, office cleaning, and more.'
    },
    {
        number: 2,
        title: 'Select date and time',
        description: 'We adapt to your schedule with total flexibility.'
    },
    {
        number: 3,
        title: 'Enjoy your clean home',
        description: 'Our team takes care of the rest. Guaranteed.'
    }
];

export default function StepsSection() {
    return (
        <section className='py-5'>
            <div className='container'>
                <div className='row text-center mb-4'>
                    <div className='col-12'>
                        <h2 className='fw-bold' style={{ color: 'var(--pristine-black)' }}>
                            That easy
                        </h2>
                        <p className='text-muted'>
                           Book in 3 steps and enjoy a radiant space
                        </p>
                    </div>
                </div>
                <div className='row g-3 g-lg-4'>
                    {steps.map((step) => (
                        <div className='col-12 col-md-4' key={step.number}>
                            <div className='step p-4 bg-white rounded-2xl shadow-soft h-100 text-center'>
                                <div className='step-index mx-auto mb-2'>
                                    {step.number}
                                </div>
                                <h3 className='h5'>{step.title}</h3>
                                <p className='text-muted mb-0'>{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
