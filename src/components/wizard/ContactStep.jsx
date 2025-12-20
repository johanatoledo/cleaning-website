// src/components/wizard/ContactStep.jsx (Refactorizado)

import React, { useState } from 'react';
import { useBooking, useAuth } from '../../context/useBookingHooks';

export default function ContactStep() {
    const { booking, updateBooking, currentQuote } = useBooking();
    const { csrfToken } = useAuth();
    const { customer } = booking;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [submitError, setSubmitError] = useState('');

    // Manejo de inputs del cliente
    const handleCustomerChange = (e) => {
        const { name, value } = e.target;
        // Actualiza el objeto anidado 'customer' haciendo merge
        updateBooking('customer', { ...customer, [name]: value });
    };

    // Función para enviar la cotización al cliente
    const handleSubmitQuote = async () => {
        setIsSubmitting(true);
        setSubmitMessage('');
        setSubmitError('');

        try {
            // Validar que todos los datos requeridos estén presentes
            if (!booking.serviceCode || !booking.date || !booking.time || !customer.name || !customer.email || !customer.phone) {
                setSubmitError('Please complete all required fields.');
                setIsSubmitting(false);
                return;
            }
          if (booking.zip.length !== 5) {
            setSubmitError('Invalid Zip Code: Must be exactly 5 digits.');
             setIsSubmitting(false);
           return;
       }
         // 1. Mapeo de Frecuencia (Frontend -> Backend)
        const freqMap = {
            'Once': 'one-time',
            'Weekly': 'weekly',
            'Bi-weekly': 'biweekly',
            'Monthly': 'monthly'
        };

        // 2. Construcción del Payload siguiendo estrictamente el controlador
        const payload = {
            serviceCode: String(booking.serviceCode),
            beds: parseInt(booking.beds, 10),  // Forzar Entero
            baths: parseInt(booking.baths, 10), // Forzar Entero
            freq: freqMap[booking.freq] || 'one-time', // Normalizar frecuencia
            extras: booking.extras || [],
            date: booking.date, // Debe ser YYYY-MM-DD
            time: booking.time, // Debe ser HH:MM
            address: String(booking.address),
            zip: String(booking.zip),
            customer: {
                name: String(customer.name),
                email: String(customer.email).toLowerCase().trim(),
                phone: String(customer.phone).replace(/\D/g, '') // Solo números
            },
            // IMPORTANTE: El backend pide un Entero (usualmente centavos)
            quoteAmount: Math.round(currentQuote?.amount || 0) 
        };

        console.log("📤 Payload Refactorizado:", payload);
            // Enviar la cotización al backend
            const response = await fetch('/api/bookings/quote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                // Mostrar el mensaje de error real del backend
                let backendMsg = errorData.error || errorData.message || 'Failed to send quote.';
                if (errorData.error && errorData.message && errorData.error !== errorData.message) {
                    backendMsg = `${errorData.error} - ${errorData.message}`;
                }
                throw new Error(backendMsg);
            }

            const result = await response.json();
            setSubmitMessage(`Quote sent successfully! Confirmation ID: ${result.quoteId}`);
            
            // Opcional: Limpiar el formulario después del envío exitoso
            setTimeout(() => {
                // Podrías redirigir o mostrar un mensaje de éxito
                console.log('Quote submitted successfully:', result);
            }, 2000);

        } catch (error) {
            console.error('Error submitting quote:', error);
            setSubmitError(error.message || 'An error occurred while sending the quote.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="wizard-step step-4">
            <h3 className="mb-4 text-center">Step 4: Contact Information & Quote Confirmation</h3>
            
            <div className="row justify-content-center">
                <div className="col-12 col-lg-10">
                    
                    {/* 1. CONTACTO */}
                    <div className="card shadow-sm p-4 mb-4">
                        <h4 className="h5 fw-bold mb-3">Your Contact Details</h4>
                        <div className="row g-3">
                            <div className="col-12">
                                <label htmlFor="name" className="form-label">Full Name</label>
                                <input type="text" className="form-control" name="name" id="name" value={customer.name} onChange={handleCustomerChange} required />
                            </div>
                            <div className="col-12 col-sm-6">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" className="form-control" name="email" id="email" value={customer.email} onChange={handleCustomerChange} required />
                            </div>
                            <div className="col-12 col-sm-6">
                                <label htmlFor="phone" className="form-label">Phone</label>
                                <input type="tel" className="form-control" name="phone" id="phone" value={customer.phone} onChange={handleCustomerChange} required />
                            </div>
                        </div>
                    </div>

                    {/* 2. RESUMEN DE LA COTIZACIÓN */}
                    <div className="card shadow-sm p-4 mb-4 bg-light">
                        <h4 className="h5 fw-bold mb-3">Quote Summary</h4>
                        <div className="row g-3">
                            <div className="col-12 col-sm-6">
                                <small className="text-muted">Service:</small>
                                <p className="mb-0"><strong>{booking.serviceCode}</strong></p>
                            </div>
                            <div className="col-12 col-sm-6">
                                <small className="text-muted">Date & Time:</small>
                                <p className="mb-0"><strong>{booking.date} at {booking.time}</strong></p>
                            </div>
                            <div className="col-12 col-sm-6">
                                <small className="text-muted">Property Size:</small>
                                <p className="mb-0"><strong>{booking.beds} bed(s), {booking.baths} bath(s)</strong></p>
                            </div>
                            <div className="col-12 col-sm-6">
                                <small className="text-muted">Frequency:</small>
                                <p className="mb-0"><strong>{booking.freq}</strong></p>
                            </div>
                            <div className="col-12">
                                <hr />
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5>Total Quote:</h5>
                                    <h4 className="text-brand mb-0">${Math.round(currentQuote?.amount || 0)}</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. INFORMACIÓN */}
                    <div className="alert alert-info mb-4">
                        <p className="mb-0">By clicking "Confirm & Request Quote," we will send you a detailed quote to your email. Once you review and confirm the service, we will add it to our system for processing.</p>
                    </div>

                    {/* 4. MENSAJES DE ESTADO */}
                    {submitMessage && (
                        <div className="alert alert-success" role="alert">
                            {submitMessage}
                        </div>
                    )}
                    {submitError && (
                        <div className="alert alert-danger" role="alert">
                            {submitError}
                        </div>
                    )}

                    {/* 5. BOTÓN DE ENVÍO DE COTIZACIÓN */}
                    <div className="d-grid gap-2">
                        <button 
                            type="button"
                            className="btn btn-success btn-lg"
                            onClick={handleSubmitQuote}
                            disabled={isSubmitting || submitMessage !== ''}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Sending...
                                </>
                            ) : (
                                'Confirm & Request Quote'
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

