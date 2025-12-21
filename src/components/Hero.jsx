import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bannerImage from '../assets/banner.png';

export default function Hero() {
    const navigate = useNavigate();
    const [quoteData, setQuoteData] = useState({
        service: '',
        bBeds: 2,
        bBaths: 1,
        bFreq: 'Once',
        zip: ''
    });
    const [quoteResult, setQuoteResult] = useState(null);
    const [showResult, setShowResult] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQuoteData(prev => ({
            ...prev,
            [name]: name === 'bBeds' || name === 'bBaths' ? parseInt(value) : value
        }));
    };

    const handleQuoteSubmit = (e) => {
        e.preventDefault();
        console.log('Quick quote requested:', quoteData);
        
        setQuoteResult({
            service: quoteData.service,
            price: '$150 - $300'
        });
        setShowResult(true);
    };

    const handleBookNow = () => {
        navigate('/booking');
    };

    return (
        <section 
            className='hero hero-min'
            style={{ backgroundImage: `url(${bannerImage})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}
        >
            <div className='container py-5'>
                <div className='row align-items-center g-4'>
                    
                    <div className='col-12 col-lg-6'>
                        <span className='badge rounded-pill brand-pill mb-3' style={{ background: 'rgba(187, 91, 235, 0.3)', color: 'var(--pristine-black)' }} >
                            Professional Cleaning · Fast · Guaranteed
                        </span>
                        <h1 className='display-5 fw-bold lh-tight mb-3'>
                            Your spotless home in hours, not days!
                        </h1>
                        <p className='lead mb-4'>
                            We take care of your home with our professional cleaning services. Book now and enjoy a pristine space.
                        </p>
                        
                        
                        <div className='d-flex gap-4 mt-4 small text-muted'>
                            <div className='d-flex align-items-center gap-2'>
                                <span className='icon-circle' style={{ background: 'rgba(46,191,165,.12)', color: 'var(--pristine-black)' }}>
                                    <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                                        <polyline points='20 6 9 17 4 12'></polyline>
                                    </svg>
                                </span>
                                Verified staff
                            </div>
                            <div className='d-flex align-items-center gap-2'>
                                <span className='icon-circle'  style={{ background: 'rgba(187, 91, 235, 0.12)', color: 'var(--pristine-black)' }}>
                                    <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                                        <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'></path>
                                    </svg>
                                </span>
                                100% Guarantee
                            </div>
                            <div className='d-flex align-items-center gap-2'>
                                <span className='icon-circle' style={{ background: 'rgba(46,191,165,.12)', color: 'var(--pristine-black)' }}>
                                    <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                                        <path d='M3 3h18v4H3z'></path>
                                        <path d='M16 7v13a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V7'></path>
                                    </svg>
                                </span>
                                Eco-friendly
                            </div>
                        </div>
                    </div>

                   
                    <div className='col-12 col-lg-6'>
                        <div className='p-3 p-lg-4 bg-white-opaco rounded-2xl shadow-soft'>
                            <h2 className='h5 mb-3'>Get a quick quote</h2>
                            <form id='quickQuoteForm' className='row g-2' onSubmit={handleQuoteSubmit}>
                                
                                <div className='col-12 col-md-6'>
                                    <label className='form-label'>Type of service</label>
                                    <select
                                        className='form-select'
                                        name='service'
                                        value={quoteData.service}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value=''>Select…</option>
                                        <option value='Regular'>House cleaning</option>
                                        <option value='Deep'>Deep cleaning</option>
                                        <option value='Preparation'>Preparation cleaning</option>
                                        <option value='MovingOut'>Moving cleaning</option>
                                        <option value='Apartment'>Apartment cleaning</option>
                                        <option value='Office'>Office cleaning</option>
                                    </select>
                                </div>

                                
                                <div className='col-6 col-md-3'>
                                    <label className='form-label'>Rooms</label>
                                    <input
                                        type='number'
                                        min='0'
                                        max='10'
                                        className='form-control'
                                        name='bBeds'
                                        value={quoteData.bBeds}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                               
                                <div className='col-6 col-md-3'>
                                    <label className='form-label'>Bathrooms</label>
                                    <input
                                        type='number'
                                        min='1'
                                        max='10'
                                        className='form-control'
                                        name='bBaths'
                                        value={quoteData.bBaths}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                
                                <div className='col-12 col-md-6'>
                                    <label className='form-label'>Frequency</label>
                                    <select
                                        className='form-select'
                                        name='bFreq'
                                        value={quoteData.bFreq}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value='Once'>Once</option>
                                        <option value='Weekly'>Weekly</option>
                                        <option value='Biweekly'>Biweekly</option>
                                        <option value='Monthly'>Monthly</option>
                                    </select>
                                </div>

                                
                                <div className='col-12 col-md-6'>
                                    <label className='form-label'>Zip code</label>
                                    <input
                                        type='text'
                                        className='form-control'
                                        name='zip'
                                        placeholder='00000'
                                        pattern='[0-9]{4,6}'
                                        value={quoteData.zip}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                               
                                <div className='col-12 d-grid d-md-flex gap-2 mt-2'>
                                    <button className='btn btn-brand' type='submit'>
                                        See rates
                                    </button>
                                    <button
                                        className='btn btn-outline-brand'
                                        type='button'
                                        onClick={handleBookNow}
                                    >
                                        Book now
                                    </button>
                                </div>
                                <small className='text-muted'>Instant estimate · No obligation</small>
                            </form>

                           
                            {showResult && (
                                <div id='quickQuoteResult' className='alert alert-info mt-3'>
                                    <strong>Estimate for {quoteData.service}:</strong> {quoteResult.price}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}