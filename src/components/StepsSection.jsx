import React from 'react';

const arrowImg = 'https://cdn-icons-png.flaticon.com/128/7345/7345022.png';

const steps = [
    { number: 1, title: 'Choose the service' },
    { number: 2, title: 'Select date and time' },
    { number: 3, title: 'Enjoy your clean home' }
];

export default function StepsSection() {
    return (
        <section className='py-5 stepsSection' >
            <div className='container'>
                <div className='row text-center mb-5 '>
                    <div className='col-12'>
            
                        <h3 className='lyrics'>Book in 3 steps and enjoy a radiant space</h3>
                    </div>
                </div>

                <div className='row justify-content-center align-items-stretch'>
                    {steps.map((step, index) => (
                        <div 
                            key={step.number} 
                            className='col-12 col-md-4 position-relative d-flex align-items-center'
                        >
                            {/* Tarjeta del Paso */}
                            <div className='step p-4  rounded-4  w-100 text-center z-1'>
                                <div className='step-index mx-auto mb-2'>
                                    <h2>{step.number}</h2>
                                </div>
                                <h3 className='h5 mb-0'>{step.title}</h3>
                            </div>

                            
                            {index < steps.length - 1 && (
                                <div 
                                    className='d-none d-md-block position-absolute'
                                    style={{ 
                                        right: '-15%', 
                                        top: '50%', 
                                        transform: 'translateY(-50%)',
                                        zIndex: 10,
                                        width: '40px'
                                    
                                    }}
                                >
                                    <img 
                                        src={arrowImg} 
                                        alt="Next step" 
                                        className="img-fluid"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}