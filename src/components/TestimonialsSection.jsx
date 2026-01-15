import React, { useState, useEffect } from 'react';

const testimonials = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        quote: '"I booked a day in advance and they left the apartment spotless. 10/10."',
        rating: 5,
        name: 'Carla M.',
        location: 'Palermo'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=200&auto=format&fit=crop',
        quote: '"Punctual and very detailed. I\'ll be back monthly."',
        rating: 5,
        name: 'Lucas D.',
        location: 'Núñez'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop',
        quote: '"I loved that they use organic products."',
        rating: 5,
        name: 'Ana R.',
        location: 'Belgrano'
    }
];

export default function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

  
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, []);

   

  

    return (
        <section className='py-5 bg-magenta'>
            <div className='container'>
                <div className='row text-center mb-4'>
                    <div className='col-12'>
                        <h2 className='fw-bold lyrics-black'>Happy clients</h2>
                        <p className='text-muted'>Social proof that speaks for us</p>
                    </div>
                </div>

                <div id='carouselTestimonials' className='carousel slide ' data-bs-ride='carousel'>
                    <div className='carousel-inner'>
                        {testimonials.map((testimonial, index) => (
                            <div
                                className={`carousel-item ${index === currentIndex ? 'active' : ''}`}
                                key={testimonial.id}
                            >
                                <div className='row justify-content-center '>
                                    <div className='col-12 col-md-8'>
                                        <div className='bg-magenta rounded-2xl  p-4 p-lg-5 text-center'>
                                            <img
                                                className='testimonial-photo mb-3'
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                style={{ width: '120px', height: '120px' }}
                                            />
                                            <p className='lead mb-1'>{testimonial.quote}</p>
                                            <div className='text-warning mb-2'>
                                                {'★'.repeat(testimonial.rating)}
                                            </div>
                                            <div className='small lyrics-black'>
                                                {testimonial.name} · {testimonial.location}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    
                </div>
            </div>
        </section>
    );
}

  
