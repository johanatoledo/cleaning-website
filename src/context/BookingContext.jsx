
import React, { useContext, useState, useEffect, useCallback,  useMemo } from 'react';
import { BookingContext, AuthContext } from './contexts';
import useQuote from './useQuote';

const initialBookingState = {
    
    serviceCode: '',
    beds: 1,
    baths: 1,
    freq: 'Once', 
    extras: [],
    date: '',
    time: '',
    address: '',
    zip: '',
    customer: { name: '', email: '', phone: '' },
    
};

export const AuthProvider = ({ children }) => {
    const [csrfToken, setCsrfToken] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCsrfToken = useCallback(async () => {
        try {
           const res = await fetch('/api/csrf-token', {
            method: 'GET',
            credentials: 'include' 
        });
            
        
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError("Oops, we didn't get JSON from the server! Check your API route.");
            }

            if (!res.ok) throw new Error('Failed to get CSRF token.');
            
            const data = await res.json();
            setCsrfToken(data.csrfToken);
            console.log('CSRF Token obtenido correctamente');
            setIsLoading(false);
        } catch (err) {
            console.error('Error getting CSRF token:', err);
            setError('Connection error with the server.');
            setIsLoading(false);
        }
    }, []);

    

    useEffect(() => {
        fetchCsrfToken();
    }, [fetchCsrfToken]);

    const value = { csrfToken, isLoading, error };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export const BookingProvider = ({ children }) => {
    const { csrfToken } = useContext(AuthContext);
    const [booking, setBooking] = useState(initialBookingState);
    const [currentStep, setCurrentStep] = useState(1);

    // Lógica de preparación de datos (se mantiene aquí o puede ir a un util externo)
    const getQuotePayload = useCallback((bookingData) => {
        if (!bookingData.serviceCode) return null;

        const freqMap = {
            'Once': 'one-time', 'Weekly': 'weekly',
            'Bi-weekly': 'biweekly', 'Biweekly': 'biweekly', 'Monthly': 'monthly',
        };

        const quoteAmount = bookingData.quoteAmount || 
            (5000 + (Number(bookingData.beds) * 1000) + (Number(bookingData.baths) * 1000));

        return {
            ...bookingData,
            freq: freqMap[bookingData.freq] || 'one-time',
            beds: Number(bookingData.beds),
            baths: Number(bookingData.baths),
            quoteAmount: Number(quoteAmount)
        };
    }, []);

    // USO DEL CUSTOM HOOK
    const { 
        currentQuote, setCurrentQuote, quoteLoading, uiMessage, fetchQuote 
    } = useQuote(csrfToken, getQuotePayload);
    // --- INSERTAR AQUÍ EL EFECTO DISPARADOR ---
useEffect(() => {
    // Solo disparamos si hay un servicio seleccionado Y tenemos el token de seguridad
    if (booking.serviceCode && csrfToken) {
        console.log("Sincronización: Disparando fetchQuote automáticamente...");
        fetchQuote(booking);
    }
}, [booking, csrfToken, fetchQuote]);

    const updateBooking = useCallback((key, value) => {
        if (key === 'customer') {
            setBooking(prev => ({
                ...prev,
                customer: { ...prev.customer, ...value }
            }));
        } else {
            setBooking(prev => ({ ...prev, [key]: value }));
        }
    }, []);

    const value = useMemo(() => ({
        booking,
        updateBooking,
        setBooking,
        currentStep,
        setCurrentStep,
        currentQuote,
        setCurrentQuote, 
        quoteLoading,
        uiMessage,
        fetchQuote,
        initialBookingState
    }), [booking, updateBooking, currentStep, currentQuote, setCurrentQuote, quoteLoading, uiMessage, fetchQuote]);

    return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};