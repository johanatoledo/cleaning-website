
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useBookingHooks';

export default function ConfirmQuote() {
    const { quoteId } = useParams();
    const navigate = useNavigate();
    const { csrfToken } = useAuth();
    
    const [loading, setLoading] = useState(true);
    const [quote, setQuote] = useState(null);
    const [error, setError] = useState('');
    const [confirming, setConfirming] = useState(false);
    const [success, setSuccess] = useState(false);


    const fetchQuote = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/bookings/quote/${quoteId}`, {
               method: 'GET',
               credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Quote not found');
            }

            const data = await response.json();
            const quoteData = data.quote || data;
            setQuote(quoteData);
            setLoading(false);

        } catch (err) {
            console.error('Error fetching quote:', err);
            setError(err.message || 'Failed to load quote. Please check the link and try again.');
            setLoading(false);
        }
    }, [quoteId]);

    useEffect(() => {
        fetchQuote();
    }, [fetchQuote]);


    const handleConfirm = async () => {
        try {
            setConfirming(true);
            setError('');

            const response = await fetch(`/api/bookings/quote/${quoteId}/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({ customerConfirmation: true })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to confirm service');
            }

            await response.json();
            setSuccess(true);

            
            setTimeout(() => {
                navigate('/');
            }, 3000);

        } catch (err) {
            console.error('Error confirming quote:', err);
            setError(err.message || 'Failed to confirm service. Please try again.');
        } finally {
            setConfirming(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading quote details...</p>
            </div>
        );
    }

    if (error && !quote) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error!</h4>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="container py-5">
                <div className="alert alert-success" role="alert">
                    <h4 className="alert-heading">Service Confirmed! ✓</h4>
                    <p>Thank you for confirming your service. Our team will contact you shortly.</p>
                    <hr />
                    <p className="mb-0">Redirecting to home page...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <h1 className="mb-4 text-center">Confirm Your Service</h1>

                    {quote && (
                        <>
                            
                            <div className="card shadow-sm mb-4">
                                <div className="card-header bg-primary text-white">
                                    <h5 className="mb-0">Quote Details</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <small className="text-muted">Quote ID</small>
                                            <p className="mb-0 fw-bold">{quote.quote_id || quote.quote_id}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <small className="text-muted">Service Type</small>
                                            <p className="mb-0 fw-bold">{quote.service_code || quote.service_code}</p>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <small className="text-muted">Date & Time</small>
                                            <p className="mb-0 fw-bold">
                                                {new Date(quote.date || quote.service_date).toLocaleDateString()} at {quote.time || quote.service_time}
                                            </p>
                                        </div>
                                        <div className="col-md-6">
                                            <small className="text-muted">Property Size</small>
                                            <p className="mb-0 fw-bold">
                                                {quote.beds} bed(s), {quote.baths} bath(s)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <small className="text-muted">Frequency</small>
                                            <p className="mb-0 fw-bold">{quote.frequency}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <small className="text-muted">Address</small>
                                            <p className="mb-0 fw-bold">{quote.address}</p>
                                        </div>
                                    </div>

                                    <hr />

                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0">Total Amount:</h5>
                                        <h4 className="text-brand mb-0">
                                            ${(quote.quote_amount / 100).toFixed(2)}
                                        </h4>
                                    </div>
                                </div>
                            </div>

                        
                            <div className="card shadow-sm mb-4">
                                <div className="card-header bg-secondary text-white">
                                    <h5 className="mb-0">Customer Information</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <small className="text-muted">Name</small>
                                            <p className="mb-0 fw-bold">{quote.customer_name}</p>
                                        </div>
                                        <div className="col-md-4">
                                            <small className="text-muted">Email</small>
                                            <p className="mb-0">{quote.email}</p>
                                        </div>
                                        <div className="col-md-4">
                                            <small className="text-muted">Phone</small>
                                            <p className="mb-0">{quote.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        
                            <div className="alert alert-info mb-4">
                                <h5 className="alert-heading">Before You Confirm</h5>
                                <ul className="mb-0">
                                    <li>Make sure all the details are correct</li>
                                    <li>Our team will contact you to confirm the appointment</li>
                                    <li>Payment options will be discussed before the service date</li>
                                </ul>
                            </div>

                            
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            
                            <div className="d-grid gap-2 d-md-flex justify-content-md-between">
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => navigate('/')}
                                    disabled={confirming}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-success btn-lg"
                                    onClick={handleConfirm}
                                    disabled={confirming}
                                >
                                    {confirming ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Confirming...
                                        </>
                                    ) : (
                                        'Confirm Service'
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
